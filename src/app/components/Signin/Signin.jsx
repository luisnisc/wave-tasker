"use client";
import React from "react";
import { useState } from "react";
import "../../../../styles/Signin.css";
import Swal from "sweetalert2";
import VisibilityIcon from "@mui/icons-material/Visibility";
export default function Signin() {
  const [passwordInput, setPasswordInput] = useState("password");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("password");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handlePasswordVisibility = () => {
    if (passwordInput === "password") {
      setPasswordInput("text");
    } else {
      setPasswordInput("password");
    }
  };
  const handleConfirmPasswordVisibility = () => {
    if (confirmPasswordInput === "password") {
      setConfirmPasswordInput("text");
    } else {
      setConfirmPasswordInput("password");
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }else{
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        console.log(
          "User: " +
            username +
            " added"
        );
        const newProduct = await response.json();
        console.log(newProduct);
        
        Swal.fire({
          title: "User added successfully!",
          text: "",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#a5dc86",
          background: "#272727",
          customClass: {
            confirmButton: "sweet-alert-button",
            title: "sweet-alert-title",
            content: "sweet-alert-content",
          },
        }).then(() => {
          window.location.href = '/';
        });
        
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="absolute top-0 left-0 m-4 text-5xl text-white font-bold italic">
        WaveTasker
      </h1>
      <div className="absolute top-0 right-0 m-4 text-white mt-7 mr-9">
        <a href="/">Log In</a>
      </div>
      <div
        id="signin"
        className="text-black border border-solid rounded-xl flex justify-center "
      >
        <form
          onSubmit={handleSubmit}
          className=""
        >
          <div className="mt-8">
            <label
              htmlFor="email"
              className="text-lg w-10 "
            >
              Email
              <br />
              <input
                type="text"
                id="email"
                className="border border-solid rounded-xl h-10 w-64 p-2 border-gray-300 focus:border-black focus:outline-none focus:border-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={true}
              />
            </label>
          </div>
          <div className="mt-6">
            <label
              htmlFor="username"
              className="text-lg w-10 "
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
              className="text-lg w-10"
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

                <VisibilityIcon
                  onClick={handlePasswordVisibility}
                  sx={{ color: "gray" }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                />
              </div>
            </label>
          </div>
          <br />
          <div>
            <label
              htmlFor="passwordConfirm"
              className="text-lg w-10"
            >
              Confirm Password
              <br />
              <div className="relative">
                <input
                  type={confirmPasswordInput}
                  id="passwordConfirm"
                  className="border border-solid rounded-xl h-10 w-64 pr-10 pl-2 border-gray-300 focus:border-black focus:outline-none focus:border-2"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={true}
                />

                <VisibilityIcon
                  onClick={handleConfirmPasswordVisibility}
                  sx={{ color: "gray" }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                />
              </div>
            </label>
          </div>
          <br />
          <div className="flex justify-center">
            <button className="text-white bg-gray-500 w-40 h-14 text-3xl rounded-3xl mt-3">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
