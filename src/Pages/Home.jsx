import React, { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  auth,
  collection,
  getDocs,
  db,
} from "../../FirebaseConfig/Firebase";
import "./home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [blogs, setBlogs] = useState([]); // State to store combined blogs
  const navigate = useNavigate();

  // Fetch all blogs from Firestore
  const getAllBlogs = async () => {
    const blogsArray = await fetchBlogs("blogs");
    const blogDataArray = await fetchBlogs("BlogData");
    const combinedBlogs = [...blogsArray, ...blogDataArray]; // Combine the two arrays
    setBlogs(combinedBlogs); // Set the combined blogs in state
  };

  // Helper function to fetch blogs from a specified collection
  const fetchBlogs = async (collectionName) => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const blogsArray = [];
    querySnapshot.forEach((doc) => {
      const blogData = {
        ...doc.data(),
        blogId: doc.id,
      };
      blogsArray.push(blogData);
    });
    return blogsArray; // Return the fetched blogs
  };

  // Check authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Fetch blogs data on component mount
  useEffect(() => {
    getAllBlogs();
  }, []);

  // Handle blog details click
  const showBlogDetails = (blogId) => {
    navigate(`/singleblog/${blogId}`);
  };

  return (
    <div className="home-container">
      <div className="blog-grid">
        {blogs.length > 0 ? (
          blogs.map((blog, index) => (
            <div key={index} className="blog-card">
              <img src={blog.blogImg} alt={blog.title} className="blog-img" />
              <div className="blog-content">
                <p className="blog-title">{blog.title}</p>
                <p className="blog-author">Author: {blog.author}</p>
                <button
                  onClick={() => showBlogDetails(blog.blogId)}
                  className="details-button"
                >
                  Click for more details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="loader">
            <span className="loading loading-ring loading-lg"></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
