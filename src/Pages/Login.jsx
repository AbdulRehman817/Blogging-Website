import React from "react";
import { useRef, useState } from "react";
import {
  signInWithEmailAndPassword,
  auth,
} from "../../FirebaseConfig/Firebase";
import { useNavigate } from "react-router-dom";
import "./signup.css";

const Login = () => {
  let navigate = useNavigate();
  const email = useRef();
  const password = useRef();
  const [warning, setWarning] = useState("");

  const SignupBtn = (e) => {
    e.preventDefault();
    setWarning("");
    const userEmail = email.current.value;
    const userPassword = password.current.value;
    if (!userEmail) {
      setWarning("Enter your email");
      return;
    }
    if (!userPassword) {
      setWarning("Enter your password");
      return;
    }
    signInWithEmailAndPassword(auth, userEmail, userPassword)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        navigate("/");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        if (error.code === "auth/invalid-email") {
          setWarning("Invalid email format. Please enter a valid email.");
        } else {
          setWarning("Email doesnot exist");
        }
      });
  };
  return (
    <div className="signupDiv">
      <form>
        <div>
          <h1>Login Page</h1>
        </div>

        <input type="text" placeholder="Enter email" ref={email} />
        <br />
        <input type="password" placeholder="Enter password" ref={password} />

        <a href="./Signup">Don't have an account</a>

        <input type="submit" onClick={SignupBtn} />
        {warning && (
          <div role="alert" className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{warning}</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
