import React from "react";
// yeh jo prop.id hai yeh kahan ej rhe ho ..
const singleBlogCard = (props) => {
  return (
    <>
      <div style={blogCardStyle}>
        <img src={props.image} alt={blog.title} style={imgStyle} />
        <div style={{ padding: "10px" }}>
          <p style={{ fontWeight: "bold", fontSize: "18px" }}>{blog.title}</p>
          <p>Author: {props.author}</p>
          <p>Author: {props.description}</p>// karo apna kaam
          <button
            onClick={() => showBlogDetails(props.blogId)}
            style={buttonStyle}
          >
            Click for more details
          </button>
        </div>
      </div>
    </>
  );
}; // routing ka masla wo sahi hojayega wo sahi krlo check kese hoga
const blogCardStyle = {
  width: "30%",
  marginBottom: "20px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  borderRadius: "10px",
  overflow: "hidden",
  background: "#fff",
};

const imgStyle = {
  width: "100%",
  height: "200px",
  objectFit: "cover",
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  background: "linear-gradient(45deg, #43cea2, #185a9d)",
  border: "none",
  borderRadius: "5px",
  color: "#fff",
  cursor: "pointer",
};

export default singleBlogCard;
