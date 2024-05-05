"use client";
import React from "react";
import { useState, useMemo } from "react";
import "../../../../styles/Login.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Swal from "sweetalert2";
import axios from "axios";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordInput, setPasswordInput] = useState("password");
  // const randomColor = useMemo(() => {
  //   const letters = "0123456789ABCDEF";
  //   let color = "#";
  //   for (let i = 0; i < 6; i++) {
  //     color += letters[Math.floor(Math.random() * 16)];
  //   }
  //   return color;
  // }, []);
  const handlePasswordVisibility = () => {
    if (passwordInput === "password") {
      setPasswordInput("text");
    } else {
      setPasswordInput("password");
    }
  };
  const handleLogin = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.post('/api/login', { username, password });
  
      if (response.status === 200) {
        // Authentication was successful. Redirect the user to the home page.
        localStorage.setItem('userId', response.data.id);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('color', response.data.color);
        window.location.href = '/task';
      } else {
        // Authentication failed. Show an error message.
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Invalid username or password!',
        });
      }
    } catch (error) {
      // An error occurred. Show an error message.
      Swal.fire({
        icon: "error",
        title: "Oops...",
        html: '<p style="color: #ffffff;">Something had goes wrong</p>',
        confirmButtonText: "OK",
        confirmButtonColor: "#de6d6d",
        background: "#272727",
        customClass: {
          confirmButton: "sweet-alert-button",
          title: "sweet-alert-title",
          content: "sweet-alert-content",
        },
      });
    }
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="absolute top-0 left-0 m-4 text-5xl text-white font-bold italic select-none">WaveTasker</h1>
      <div className="absolute top-0 right-0 m-4 text-white mt-7 mr-9 select-none">
        <a href="./signin">Sign in</a>
      </div>
      <div
        id="login"
        className="text-black border border-solid rounded-xl flex justify-center"
      >
        <form
          onSubmit={handleLogin}
          className=""
        >
          <div className="mt-8">
            <label
              htmlFor="username"
              className="text-lg w-10 select-none"
            >
              Username
              <br />
              <input
                type="text"
                id="username"
                className="border border-solid rounded-xl h-10 w-64 p-2 border-gray-300 focus:border-black focus:outline-none focus:border-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={true}
              />
            </label>
          </div>
          <br />
          <div>
            <label
              htmlFor="password"
              className="text-lg w-10 select-none"
            >
              Password
              <br />
              <div className="relative">
                <input
                  type={passwordInput}
                  id="password"
                  className="border border-solid rounded-xl h-10 w-64 pr-10 pl-2 border-gray-300 focus:border-black focus:outline-none focus:border-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={true}
                />
                
                <VisibilityIcon onClick={handlePasswordVisibility} sx={{color:"gray"}} className="absolute right-2 top-1/2 transform -translate-y-1/2" />
                
              </div>
            </label>
            <a
              href="/forgotYourPassword"
              className="text-sm select-none"
            >
              Forgot Password?
            </a>
          </div>
          <br />
          <div className="flex justify-center">
            <button className="text-white bg-gray-500 w-40 h-14 text-3xl rounded-3xl">
              Enter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
