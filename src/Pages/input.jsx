import React, { useRef } from "react";
import {
  addDoc,
  collection,
  ref,
  db,
  uploadBytesResumable,
  getDownloadURL,
  storage,
} from "../../FirebaseConfig/Firebase.js";

const Input = () => {
  let image;
  const file = useRef();
  const text = useRef();
  const author = useRef();
  const category = useRef();
  const content = useRef();

  const addDataToFirebase = async (e) => {
    e.preventDefault();

    const selectedFile = file.current.files[0]; // Get the file input

    // Check if a file is selected
    if (!selectedFile) {
      console.error("No file selected.");
      return;
    }

    // Create a storage reference for the file
    const storageRef = ref(storage, `blogImages/${selectedFile.name}`);

    // Upload the file to Firebase Storage
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Monitor the upload progress (optional)
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error("File upload error:", error);
      },
      async () => {
        // Handle successful uploads on complete
        try {
          // Get the download URL of the uploaded file
          image = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at", image);

          // Add blog data to Firestore, including the image URL
          const docRef = await addDoc(collection(db, "blogs"), {
            title: text.current.value,
            blogImg: image,
            author: author.current.value,
            category: category.current.value,
            content: content.current.value,
          });

          console.log("Document written with ID: ", docRef.id);
        } catch (error) {
          console.error("Error adding document to Firestore:", error);
        }
      }
    );
  };

  return (
    <>
      <input type="file" ref={file} />
      <br />
      <br />
      <input type="text" ref={text} placeholder="Enter title" />
      <br />
      <br />
      <input type="text" ref={content} placeholder="Enter description" />
      <br />
      <br />
      <input type="text" ref={author} placeholder="Enter author" />
      <br />
      <br />
      <input type="text" ref={category} placeholder="Enter category" />
      <br />
      <br />
      <button onClick={addDataToFirebase}>Submit</button>
      <br />
      <br />
    </>
  );
};

export default Input;
