import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Layout from "../Layout.jsx";
import Home from "./Pages/Home.jsx";
import UserBlog from "./Pages/UserBlog.jsx";
import Signup from "./Pages/Signup.jsx";
import Login from "./Pages/Login.jsx";
import AddBlog from "./Pages/AddBlog.jsx";
import SingleBlog from "./Pages/singleBlog.jsx";
import Input from "./Pages/input.jsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "addblog",
        element: <AddBlog />,
      },
      {
        path: "userblog",
        element: <UserBlog />,
      },
      {
        path: "singleblog/:id",
        element: <SingleBlog />,
      },
    ],
  },

  {
    path: "login",
    element: <Login />,
  },
  {
    path: "signup",
    element: <Signup />,
  },
  {
    path: "input",
    element: <Input />,
  },

  {
    path: "*",
    element: "NOT FOUND!",
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router}>
    <Outlet />
  </RouterProvider>
);
