"use client";
import { useState, useEffect } from "react";
import React from "react";
import Swal from "sweetalert2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "../../../../styles/ForgotYourPasswordForm.css";
export default function ForgotYourPasswordForm() {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("password");
  const [confirmNewPasswordInput, setConfirmNewPasswordInput] =
    useState("password");
  const [body, setBody] = useState("");
  const handleNewPasswordVisibility = () => {
    if (newPasswordInput === "password") {
      setNewPasswordInput("text");
    } else {
      setNewPasswordInput("password");
    }
  };
  const handleConfirmNewPasswordVisibility = () => {
    if (confirmNewPasswordInput === "password") {
      setConfirmNewPasswordInput("text");
    } else {
      setConfirmNewPasswordInput("password");
    }
  };
  /**
   * Maneja el envío del formulario.
   * @param {Event} event - Evento de envío del formulario.
   */
  const handlePasswordChange = async (event) => {
    event.preventDefault();
  
    console.log(username, newPassword, confirmNewPassword);
    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match");
      return;
    } else {
      try {
        const response = await fetch(`/api/users/${username}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({username, newPassword}),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }else{
            Swal.fire({
            title: "Password changed successfully!",
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
              window.location.href = "/";
            
            })
        }
        
        // Aquí es donde se actualiza el estado con la tarea actualizada
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  useEffect(() => {
    /**
     * Obtiene los datos de productos desde el servidor.
     */
    const fetchData = async () => {
      const response = await fetch("/api/users");
      const data = await response.json();
      setData(data);
    };

    fetchData();
  }, []);
  return (
    <div
      id="padre"
      className="flex justify-center items-center h-screen"
    >
      <h1 className="absolute top-0 left-0 m-4 text-5xl text-white font-bold italic">
        WaveTasker
      </h1>
      <div className="absolute top-0 right-0 m-4 text-white mt-7 mr-9">
        <a href="/">Log in</a>
      </div>
      <div
        id="formContainer"
        className="text-black border border-solid rounded-xl flex justify-center"
      >
        <form onSubmit={handlePasswordChange}className="">
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
                className="border border-solid rounded-xl h-10 w-64 p-2 border-gray-300 focus:border-black focus:outline-none focus:border-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
          </div>
          <br />
          <div>
            <label
              htmlFor="new password"
              className="text-lg w-10"
            >
              New Password
              <br />
              <div className="relative">
                <input
                  type={newPasswordInput}
                  id="newPassword"
                  className="border border-solid rounded-xl h-10 w-64 pr-10 pl-2 border-gray-300 focus:border-black focus:outline-none focus:border-2"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <VisibilityIcon
                  onClick={handleNewPasswordVisibility}
                  sx={{ color: "gray" }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                />
              </div>
            </label>
            <div className="mt-7">
              <label
                htmlFor="new password"
                className="text-lg w-10"
              >
                Confirm New Password
                <br />
                <div className="relative">
                  <input
                    type={confirmNewPasswordInput}
                    id="newPassword"
                    className="border border-solid rounded-xl h-10 w-64 pr-10 pl-2 border-gray-300 focus:border-black focus:outline-none focus:border-2"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                  />

                  <VisibilityIcon
                    onClick={handleConfirmNewPasswordVisibility}
                    sx={{ color: "gray" }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  />
                </div>
              </label>
            </div>
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
