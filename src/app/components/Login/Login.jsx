"use client";
import React from "react";
import { useState } from "react";
import "../../../../styles/Login.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
export default function Login() {
  const [passwordInput, setPasswordInput] = useState("password");

  const handlePasswordVisibility = () => {
    if (passwordInput === "password") {
      setPasswordInput("text");
    } else {
      setPasswordInput("password");
    }
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="absolute top-0 left-0 m-4 text-5xl text-white font-bold italic">WaveTasker</h1>
      <div className="absolute top-0 right-0 m-4 text-white mt-7 mr-9">
        <a href="./signin">Sign in</a>
      </div>
      <div
        id="login"
        className="text-black border border-solid rounded-xl flex justify-center"
      >
        <form
          action=""
          className=""
        >
          <div className="mt-8">
            <label
              htmlFor="username"
              className="text-lg w-10 "
            >
              Username
              <br />
              <input
                type="text"
                id="username"
                className="border border-solid rounded-xl h-10 w-64 p-2 focus:border-black focus:outline-none focus:border-2"
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
                  className="border border-solid rounded-xl h-10 w-64 pr-10 pl-2 focus:border-black focus:outline-none focus:border-2"
                />
                
                <VisibilityIcon onClick={handlePasswordVisibility} sx={{color:"gray"}} className="absolute right-2 top-1/2 transform -translate-y-1/2" />
                
              </div>
            </label>
            <a
              href=""
              className="text-sm"
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
