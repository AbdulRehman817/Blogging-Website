import React, { useState, useEffect } from "react";
import {
  auth,
  db,
  collection,
  getDocs,
  onAuthStateChanged,
} from "../../FirebaseConfig/Firebase";
import "./UserBlog.css";
const UserBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [Bloguid, setBloguid] = useState(null);

  useEffect(() => {
    // Listen to authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setBloguid(user.uid);
        getData(user.uid); // Fetch blog data when user is authenticated
      } else {
        setBloguid(null);
        setBlogs([]); // Clear blogs when signed out
      }
    });
    return () => unsubscribe(); // Clean up on unmount
  }, []);

  const getData = async (uid) => {
    const q = collection(db, "BlogData");
    const querySnapshot = await getDocs(q);

    const blogList = [];
    querySnapshot.forEach((doc) => {
      if (uid === doc.data().blogUid) {
        blogList.push(doc.data()); // Accumulate blog data
      }
    });

    setBlogs(blogList); // Update state with blog data
  };

  return (// ye sahi hai iska masla nahi hai user jab blog add karega jab ye ayega see mo singleblogcard mei jao
    <div className="Flex">
      {blogs.length > 0 ? (
        blogs.map((item, index) => (
          <div key={index} className="blog-card">
            <img src={item.blogImage} alt="Blog" className="blog-image" />
            <div className="blog-content">
              <h2 className="blog-title">{item.title}</h2>
              <p className="blog-description">{item.description}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No blogs found</p>
      )}
    </div>
  );
};

export default UserBlog;
