// import React, { useState, useEffect } from "react";
// import {
//   auth,
//   db,
//   collection,
//   getDocs,
//   onAuthStateChanged,
// } from "../../FirebaseConfig/Firebase";
// import "./UserBlog.css";
// const UserBlog = () => {
//   const [blogs, setBlogs] = useState([]);
//   const [Bloguid, setBloguid] = useState(null);
//   const [currentUser, setCurrentUser] = useState(null);

//   const [editingBlogId, setEditingBlogId] = useState(null);
//   const [newTitle, setNewTitle] = useState("");
//   const [newDescription, setNewDescription] = useState("");
//   useEffect(() => {
//     // Listen to authentication state
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setBloguid(user.uid);
//         getData(user.uid); // Fetch blog data when user is authenticated
//       } else {
//         setBloguid(null);
//         setBlogs([]); // Clear blogs when signed out
//       }
//     });
//     return () => unsubscribe(); // Clean up on unmount
//   }, []);

//   const getData = async (uid) => {
//     const q = collection(db, "BlogData");
//     const querySnapshot = await getDocs(q);

//     const blogList = [];
//     querySnapshot.forEach((doc) => {
//       if (uid === doc.data().blogUid) {
//         blogList.push(doc.data()); // Accumulate blog data
//       }
//     });

//     setBlogs(blogList); // Update state with blog data
//   };
//   const handleEdit = (blogs) => {
//     setEditingBlogId(blogs.id);
//     setNewTitle(blogs.title);
//     setNewDescription(blogs.description);
//   };
//   const handleSave = async (id) => {
//     const blogRef = doc(db, "BlogData", id);
//     await updateDoc(blogRef, { title: newTitle, description: newDescription });

//     setBlogs(
//       blogs.map((blogs) =>
//         blog.id === id
//           ? { ...blogs, title: newTitle, description: newDescription }
//           : blog
//       )
//     );
//     setEditingBlogId(null);
//   };

//   return (
//     <>
//       <div className="Flex">
//         {blogs.length > 0 ? (
//           blogs.map((item, index) => (
//             <div key={index} className="blog-card">
//               <img src={item.blogImage} alt="Blog" className="blog-image" />
//               {editingBlogId === blogs.id ? (
//                 <div>
//                   <input
//                     type="text"
//                     value={newTitle}
//                     onChange={(e) => setNewTitle(e.target.value)}
//                     className="edit-input"
//                   />
//                   <textarea
//                     value={newDescription}
//                     onChange={(e) => setNewDescription(e.target.value)}
//                     className="edit-input"
//                   />
//                   <button onClick={() => handleSave(blogs.id)}>Save</button>
//                 </div>
//               ) : (
//                 <div className="blog-content">
//                   <h2 className="blog-title">{item.title}</h2>
//                   <p className="blog-description">{item.description}</p>
//                   <button onClick={() => handleEdit(blogs)}>Edit</button>
//                   <button onClick={() => handleDelete(blogs.id)}>Delete</button>
//                 </div>
//               )}
//             </div>
//           ))
//         ) : (
//           <p>No blogs found</p>
//         )}
//       </div>
//     </>
//   );
// };

// export default UserBlog;
import React, { useState, useEffect } from "react";
import {
  auth,
  db,
  collection,
  getDocs,
  onAuthStateChanged,
  doc,
  updateDoc,
  deleteDoc,
} from "../../FirebaseConfig/Firebase.js";
import "./UserBlog.css";

const UserBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [Bloguid, setBloguid] = useState(null);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // Fetch blogs on auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setBloguid(user.uid);
        fetchBlogs(user.uid);
      } else {
        setBloguid(null);
        setBlogs([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchBlogs = async (uid) => {
    const q = collection(db, "BlogData");
    const querySnapshot = await getDocs(q);
    const blogList = querySnapshot.docs
      .filter((doc) => uid === doc.data().blogUid) // Only keep user's blogs
      .map((doc) => ({ id: doc.id, ...doc.data() })); // Include id
    setBlogs(blogList);
  };

  // Handle editing of the blog
  const handleEdit = (blog) => {
    setEditingBlogId(blog.id);
    setNewTitle(blog.title);
    setNewDescription(blog.description);
  };

  // Handle saving the edited blog
  const handleSave = async () => {
    const blogRef = doc(db, "BlogData", editingBlogId);
    await updateDoc(blogRef, { title: newTitle, description: newDescription });
    setBlogs(
      blogs.map((blog) =>
        blog.id === editingBlogId
          ? { ...blog, title: newTitle, description: newDescription }
          : blog
      )
    );
    setEditingBlogId(null); // Reset editing state
  };

  // Handle deleting the blog
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "BlogData", id));
    setBlogs(blogs.filter((blog) => blog.id !== id)); // Remove from state
  };

  return (
    <div className="Flex">
      {blogs.length > 0 ? (
        blogs.map((item) => (
          <div key={item.id} className="blog-card">
            <img src={item.blogImg} alt="Blog" className="blog-image" />
            {editingBlogId === item.id ? ( // Check if this blog is being edited
              <div className="edit-container">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="edit-input"
                  placeholder="Edit Title"
                />
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="edit-input"
                  placeholder="Edit Description"
                />
                <button className="btn save-btn" onClick={handleSave}>
                  Save
                </button>
                <button
                  className="btn cancel-btn"
                  onClick={() => setEditingBlogId(null)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="blog-content">
                <h2 className="blog-title">{item.title}</h2>
                <p className="blog-description">{item.description}</p>
                <div className="button-group">
                  <button
                    className="btn edit-btn"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn delete-btn"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
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
  );
};
const loaderContainerStyle = {
  display: "flex",
  justifyContent: "center",
  // alignItems: "center",
  height: "100vh", // Full viewport height
};

const loaderStyle = {
  width: "100px", // Increase loader size
  height: "100px", // Increase loader size
};
export default UserBlog;
