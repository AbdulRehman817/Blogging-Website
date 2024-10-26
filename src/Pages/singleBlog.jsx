import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, doc, getDoc } from "../../FirebaseConfig/Firebase.js";
import "./SingleBlog.css";

const SingleBlog = () => {
  const [singleBlog, setSingleBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const getBlogFromBlogs = async () => {
    try {
      const docRefBlogs = doc(db, "blogs", id);
      const docSnapBlogs = await getDoc(docRefBlogs);
      return docSnapBlogs.exists()
        ? { ...docSnapBlogs.data(), source: "blogs" }
        : null;
    } catch (error) {
      console.error("Error fetching document from blogs: ", error);
      return null;
    }
  };

  const getBlogFromBlogData = async () => {
    try {
      const docRefBlogData = doc(db, "BlogData", id);
      const docSnapBlogData = await getDoc(docRefBlogData);
      return docSnapBlogData.exists()
        ? { ...docSnapBlogData.data(), source: "BlogData" }
        : null;
    } catch (error) {
      console.error("Error fetching document from BlogData: ", error);
      return null;
    }
  };

  const getData = async () => {
    const blogFromBlogs = await getBlogFromBlogs();
    if (blogFromBlogs) {
      setSingleBlog(blogFromBlogs);
    } else {
      const blogFromBlogData = await getBlogFromBlogData();
      if (blogFromBlogData) {
        setSingleBlog(blogFromBlogData);
      } else {
        console.log("No such document in both collections!");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [id]);

  if (loading) {
    return (
      <div className="loaderContainer">
        <span className="loading loading-ring loading-lg loader"></span>
      </div>
    );
  }

  if (!singleBlog) {
    return <div>No blog found!</div>;
  }

  return (
    <div className="blogCard">
      <div className="imgWrapper">
        <img
          src={singleBlog.blogImg}
          alt={singleBlog.title}
          className="blogImg"
        />
      </div>
      <div className="content">
        <h2 className="title">{singleBlog.title}</h2>
        <p className="author">AUTHOR: {singleBlog.author}</p>
        <p className="category">CATEGORY: {singleBlog.category}</p>
        <p className="description">DESCRIPTION: {singleBlog.content}</p>
      </div>
    </div>
  );
};

export default SingleBlog;
