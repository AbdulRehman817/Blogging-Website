import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  auth,
  collection,
  db,
  onAuthStateChanged,
  signOut,
  getDocs,
} from "../../FirebaseConfig/Firebase.js"; // Ensure the correct imports

const Navbar = () => {
  // let userImage = document.querySelector("#userImage");
  // console.log(image);
  let userUid;
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);
  const [userImage, setUserImage] = useState(null);
  let navigate = useNavigate();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      userUid = user.uid;
      getAllData();
    }
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const Logout = () => {
    signOut(auth)
      .then(() => {
        navigate("/Login");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
    console.log("Logging out...");
  };

  let getAllData = async () => {
    const q = collection(db, "userData");

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (userUid === doc.data().uid) {
        setEmail(doc.data().email);
        setName(doc.data().firstName + " " + doc.data().lastName);

        setUserImage(doc.data().image);
      }
    });
  };

  return (
    <div className="navbar bg-base-100 -ml-[600px]">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Parent</a>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </li>
            <li>
              <a>Item 3</a>
            </li>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl">daisyUI</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/">Home</Link>
          </li>

          <li>
            <Link to="addblog">AddBlog</Link>
          </li>
          <li>
            <Link to="userblog">UserBlog</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              {userImage ? (
                <img
                  // alt="Tailwind CSS Navbar component"
                  id="userImage"
                  src={userImage}
                />
              ) : (
                <div className="placeholder-avatar">Loading...</div>
              )}
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li style={{ background: "#f0f4f8" }}>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li style={{ background: "#f0f4f8" }}>
              <a>{name}</a>
            </li>
            <li style={{ background: "#f0f4f8" }}>
              <a>{email}</a>
            </li>
            <li style={{ background: "#f0f4f8" }}>
              <a onClick={Logout}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// export default Navbar;
// import React from "react";

// const Navbar = () => {
//   return <div>Home</div>;
// };

export default Navbar;
