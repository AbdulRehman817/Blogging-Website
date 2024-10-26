import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  auth,
  collection,
  db,
  onAuthStateChanged,
  signOut,
  getDocs,
} from "../../FirebaseConfig/Firebase.js";

const Navbar = () => {
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  let userUid;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        userUid = user.uid;
        getAllData(userUid);
        if (user.displayName && user.photoURL) {
          setEmail(user.email);
          setName(user.displayName);
          setUserImage(user.photoURL);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const getAllData = async (uid) => {
    const q = collection(db, "userData");
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (uid === doc.data().uid) {
        setEmail(doc.data().email);
        setName(doc.data().firstName + " " + doc.data().lastName);
        setUserImage(doc.data().image);
      }
    });
  };

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
  };

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown lg:hidden">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost"
            onClick={toggleDropdown}
          >
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
          {dropdownOpen && (
            <ul className="menu menu-compact dropdown-content bg-base-100 rounded-box z-10 mt-3 p-2 shadow">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="addblog">Add Blog</Link>
              </li>
              <li>
                <Link to="userblog">User Blog</Link>
              </li>
            </ul>
          )}
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="addblog">Add Blog</Link>
            </li>
            <li>
              <Link to="userblog">User Blog</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            {userImage && (
              <div className="w-10 rounded-full">
                <img id="userImage" src={userImage} alt="User" />
              </div>
            )}
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 p-2 shadow"
          >
            <li style={{ background: "#f0f4f8" }}>
              <Link to="profile" className="justify-between">
                Profile
                <span className="badge">New</span>
              </Link>
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

export default Navbar;
