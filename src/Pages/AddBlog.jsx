import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "../../FirebaseConfig/Firebase";
import "./AddBlog.css";

const AddBlog = () => {
  const file = useRef();
  const inp = useRef();
  const textarea = useRef();
  const userName = useRef();
  const category = useRef();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const addData = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Get current user
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const blogUid = user.uid;
        const userInput = inp.current.value;
        const userTextarea = textarea.current.value;
        const userFile = file.current.files[0];
        const authorName = userName.current.value;
        const categoryName = userName.current.value;

        if (userFile) {
          const storageRef = ref(storage, `blogImages/${userFile.name}`);
          await uploadBytes(storageRef, userFile);
          const getImage = await getDownloadURL(storageRef);

          await addDoc(collection(db, "BlogData"), {
            title: userInput,
            author: authorName,
            content: userTextarea,
            category: categoryName,
            blogImg: getImage,
            blogUid: blogUid,
          });

          navigate("/"); // Redirect after successful addition
        }
      }
    });
  };

  return (
    <div className="mainDiv">
      <h1>Create a Blog</h1>
      <form onSubmit={addData} className="form">
        <input type="file" ref={file} className="file-input" />
        <div className="inputs">
          <input
            type="text"
            placeholder="Title"
            ref={inp}
            required
            className="text-input"
          />
          <br />
          <input
            type="text"
            placeholder="Enter category"
            ref={category}
            required
            className="text-input"
          />
          <br />
          <input
            type="text"
            placeholder="Enter Your Name"
            ref={userName}
            required
            className="text-input"
          />
          <br />
          <textarea
            placeholder="Add description"
            ref={textarea}
            required
            className="textarea-input"
          ></textarea>
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
