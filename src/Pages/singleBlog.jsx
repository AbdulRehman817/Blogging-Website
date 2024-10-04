import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, doc, getDoc } from "../../FirebaseConfig/Firebase.js";

const SingleBlog = () => {
  const [singleBlog, setSingleBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const getData = async () => {
    try {
      const docRef = doc(db, "blogs", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setSingleBlog(docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching document: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [id]);

  if (loading) {
    return (
      <div style={loaderContainerStyle}>
        <span
          className="loading loading-ring loading-lg"
          style={loaderStyle}
        ></span>
      </div>
    );
  }

  if (!singleBlog) {
    return <div>No blog found!</div>;
  }

  return (
    <div style={blogCardStyle}>
      <div style={imgWrapperStyle}>
        <img src={singleBlog.blogImg} alt={singleBlog.title} style={imgStyle} />
      </div>
      <div style={contentStyle}>
        <h2 style={titleStyle}>{singleBlog.title}</h2>
        <p style={authorStyle}>AUTHOR: {singleBlog.author}</p>
        <p style={authorStyle}>CATEGORY: {singleBlog.category}</p>
        <p style={descriptionStyle}>DESCRIPTION :{singleBlog.content}</p>
      </div>
    </div>
  );
};

const blogCardStyle = {
  display: "flex",
  alignItems: "flex-start",
  backgroundColor: "#f9f9f9", // Light background color
  borderRadius: "10px",
  padding: "15px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  marginBottom: "20px",
  maxWidth: "700px",
  margin: "auto",
  gap: "20px",
  marginTop: "50px",
};

const imgWrapperStyle = {
  flex: "3",
  marginRight: "20px",
};

const imgStyle = {
  width: "100%",
  height: "450px",
  // objectFit: "cover",
  borderRadius: "8px",
};

const contentStyle = {
  flex: "3",
  textAlign: "left",
};

const titleStyle = {
  fontSize: "27px",
  fontWeight: "bold",
  marginBottom: "10px",
};

const authorStyle = {
  fontSize: "14px",
  color: "#666",
  marginBottom: "10px",
};

const descriptionStyle = {
  fontSize: "16px",
  color: "#444",
  lineHeight: "1.6",
};
const loaderContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh", // Full viewport height
};

const loaderStyle = {
  width: "100px", // Increase loader size
  height: "100px", // Increase loader size
};
export default SingleBlog;
