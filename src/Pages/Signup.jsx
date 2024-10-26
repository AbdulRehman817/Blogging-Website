import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  auth,
  updateProfile,
  addDoc,
  collection,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  db,
} from "../../FirebaseConfig/Firebase"; // Ensure the correct imports
import "./signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const email = useRef();
  const password = useRef();
  const userFirstName = useRef();
  const userLastName = useRef();
  const file = useRef();

  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const loginBtn = () => {
    navigate("/Login");
  };

  const SignupBtn = async (e) => {
    e.preventDefault();
    setWarning("");
    setLoading(true); // Set loading to true when signup starts

    const userEmail = email.current.value;
    const userPassword = password.current.value;
    const firstName = userFirstName.current.value;
    const lastName = userLastName.current.value;
    const userFile = file.current.files[0];

    if (!userEmail || !userPassword || !firstName || !lastName) {
      setWarning("Please fill in all fields.");
      setLoading(false); // Stop loading if validation fails
      return;
    }

    if (!userFile) {
      setWarning("Please add your profile pic.");
      setLoading(false); // Stop loading if file is missing
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userEmail,
        userPassword
      );
      const user = auth.currentUser;
      const uid = user.uid;

      // Upload the profile picture
      const storageRef = ref(storage, `profilePic/${userFile.name}`);
      await uploadBytes(storageRef, userFile);

      // Get the download URL for the uploaded image
      const getImage = await getDownloadURL(storageRef);
      // Update the user's profile with name and photo
      await updateProfile(auth.currentUser, {
        displayName: `${firstName} ${lastName}`,
        photoURL: getImage,
      });

      // Store user data in Firestore
      await addDoc(collection(db, "userData"), {
        email: userEmail,
        firstName: firstName,
        lastName: lastName,
        image: getImage,
        uid: uid,
      });

      // Navigate to home page after successful signup
      navigate("/");
    } catch (error) {
      // Handle specific Firebase errors
      if (error.code === "auth/email-already-in-use") {
        setWarning(
          "This email is already in use. Please use a different email."
        );
      } else if (error.code === "auth/weak-password") {
        setWarning("Password is too weak. Please use a stronger password.");
      } else if (error.code === "auth/invalid-email") {
        setWarning("Invalid email format. Please enter a valid email.");
      } else {
        setWarning("Error during signup: " + error.message);
      }
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  return (
    <div className="signupDiv">
      <form>
        <h1>Signup Page</h1>
        <input type="file" ref={file} />
        <input type="text" placeholder="Enter email" ref={email} />
        <input type="password" placeholder="Enter password" ref={password} />
        <input
          type="text"
          placeholder="Enter your first name"
          ref={userFirstName}
        />
        <input
          type="text"
          placeholder="Enter your last name"
          ref={userLastName}
        />
        <a onClick={loginBtn}>Already have an account</a>
        <input type="submit" value="Signup" onClick={SignupBtn} />

        {warning && (
          <div role="alert" className="alert alert-error">
            <span>{warning}</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default Signup;
