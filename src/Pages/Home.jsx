import React, { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  auth,
  addDoc,
  collection,
  getDocs,
  db,
} from "../../FirebaseConfig/Firebase";
import { useNavigate } from "react-router-dom";
// horaha hai
// bus or kuch  nahi abhi to nahi namaz ka time hone wala hai uske bad kuch hoga
const Home = (props) => {
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

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    background: "linear-gradient(45deg, #43cea2, #185a9d)",
    border: "none",
    borderRadius: "5px",
    color: "#fff",
    cursor: "pointer",
    marginTop: "10px",
  };
  const [blogs, setBlogs] = useState([]); // State to store blogs
  const [isBlogsLoaded, setIsBlogsLoaded] = useState(false); // Loader state
  const navigate = useNavigate();
  //error pata hai kaha hai
  async function getAllBlogs() {
    const querySnapshot = await getDocs(collection(db, "blogs"));
    const blogsArray = [];

    querySnapshot.forEach((doc) => {
      // Create a blog object that includes both data and the doc id
      const blogData = {
        ...doc.data(),
        blogId: doc.id, // Assign doc.id to a new field 'blogId'
      };

      // Push the blog object into the blogsArray
      blogsArray.push(blogData);
    });

    // After the loop, update the state with the full array
    setBlogs(blogsArray);
    console.log(blogsArray);
  }

  // Sample blog data

  // Check authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login"); // Redirect to login if not authenticated
      }
    });
    return () => unsubscribe(); // Cleanup subscription
  }, [navigate]);

  // Fetch blogs data and add to Firebase
  useEffect(() => {
    getAllBlogs();
  }, []);
  //pehle check karlo add hoarha hai ya nahi
  // Add blogs to Firebase
  const addDataToFirebase = async (blogData) => {
    try {
      // Use Promise.all to wait for all blog documents to be added
      // Add a new document with a generated id.
      const docRef = await addDoc(collection(db, "blogs"), blogData);
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding blogs:", error);
    }
    console.log(blogData);
  };

  // Handle blog details click
  const showBlogDetails = (blogid) => {
    console.log(blogid);

    navigate(`/singleblog/${blogid}`); // Navigate to blog details page
  };

  return (
    <div style={{ background: "#f0f4f8", padding: "20px", marginTop: "20px" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
        }}
      >
        {blogs.length > 0 ? (
          blogs.map((blog, index) => (
            <div key={index} style={blogCardStyle}>
              <img src={blog.blogImg} alt={blog.title} style={imgStyle} />
              <div style={{ padding: "10px" }}>
                <p style={{ fontWeight: "bold", fontSize: "18px" }}>
                  {blog.title}
                </p>
                <p>Author: {blog.author}</p>
                <button
                  onClick={() => showBlogDetails(blog.blogId)}
                  style={buttonStyle}
                >
                  Click for more details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={loaderContainerStyle}>
            <span
              className="loading loading-ring loading-lg"
              style={loaderStyle}
            ></span>
          </div>
        )}
      </div>
    </div>
  );

  // Style objects for better readability
};
export default Home;
