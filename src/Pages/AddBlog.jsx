import React, { useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import {
  onAuthStateChanged,
  auth,
  addDoc,
  collection,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  db,
} from "../../FirebaseConfig/Firebase"; // Adjust the import path as needed
import "./AddBlog.css";

const AddBlog = () => {
  const file = useRef();
  const inp = useRef();
  const textarea = useRef();
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  const addData = async (e) => {
    e.preventDefault();

    let blogUid;

    // Get current user
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        blogUid = user.uid;

        // Get user input values
        const userInput = inp.current.value;
        const userTextarea = textarea.current.value;
        const userFile = file.current.files[0]; // Get the first file

        if (userFile) {
          const storageRef = ref(storage, `profilePic/${userFile.name}`);
          await uploadBytes(storageRef, userFile);

          // Get the download URL for the uploaded image
          const getImage = await getDownloadURL(storageRef);
          console.log("Profile Image URL:", getImage);

          // Add document to Firestore
          const docRef = await addDoc(collection(db, "BlogData"), {
            title: userInput,
            description: userTextarea,
            blogImage: getImage,
            blogUid: blogUid,
          });
          console.log("Document written with ID:", docRef.id);

          // Redirect after successful addition
          navigate("/");
        } else {
          alert("Please upload an image.");
        }
      } else {
        alert("User is not authenticated.");
      }
    });
  };

  return (
    <>
      <h1>Create a Blog</h1>
      <div className="Div">
        <input type="file" ref={file} />
        <br />
        <br />
        <div className="inputs">
          <input type="text" placeholder="Title" ref={inp} required />
          <br />
          <br />
          <textarea
            placeholder="Add description"
            ref={textarea}
            required
          ></textarea>
        </div>
        <br />
        <input type="submit" onClick={addData}></input>
      </div>
    </>
  );
};

export default AddBlog;
