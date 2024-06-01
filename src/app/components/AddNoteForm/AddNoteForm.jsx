"use client";
import { useState, useEffect } from "react";
import React from "react";
import Avatar from "@mui/material/Avatar";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import "../../../../styles/AddNoteForm.css";
import AvatarCustom from "../Avatar/AvatarCustom";
export default function AddNoteForm() {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [userId, setUserId] = useState("");
  const [body, setBody] = useState("");

  /**
   * Maneja el envío del formulario.
   * @param {Event} event - Evento de envío del formulario.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Llama a la API para agregar una nota
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, body, userId }),
      });
      // Alerta de error
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        console.log("Note: " + title + " added");
        const newNote = await response.json();
        console.log(newNote);
        // Alerta de éxito
        Swal.fire({
          title: "Note added successfully!",
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
          // Redirige a la página de notas
          window.location.href = "/notes";
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
    
  };
  useEffect(() => {
    // Verifica si estás en el navegador antes de acceder a localStorage
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("userId"));
    }
  }, []);
  useEffect(() => {
    /**
     * Obtiene los datos de notas desde el servidor.
     */
    const fetchData = async () => {
      const response = await fetch("/api/notes");
      const data = await response.json();
      setData(data);
    };

    fetchData();
  }, []);
  return (
    <div
      id="padre"
      className="flex justify-center items-center h-screen "
    >
      <AvatarCustom/>
     
      <div className="absolute top-0 right-0 m-5 text-4xl mr-7">
        <a href="/notes">
          <button>
            <CloseIcon
              sx={{ color: "white" }}
              className="text-4xl mr-4"
            />
          </button>
        </a>
      </div>
      <div
        id="formContainer"
        className="rounded-3xl flex justify-center"
      >
        <form
          onSubmit={handleSubmit}
          className="h-full"
        >
          <div className="mt-7 w-80">
            <label htmlFor="title">
              <div className="text-2xl">Title</div>
              <div>
                <input
                  type="text"
                  name="title"
                  id="title"
                  className=" w-80 h-12 rounded-2xl border-2 p-2 border-gray-300 focus:border-black focus:outline-none focus:border-2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required={true}
                />
              </div>
            </label>
          </div>
          <div className="mt-7 w-80">
            <label htmlFor="body">
              <div className="text-2xl">Body</div>
              <div>
                <textarea
                  name="body"
                  id="body"
                  className=" w-80 h-60 rounded-2xl border-2 border-gray-300 p-2 focus:border-black focus:outline-none focus:border-2 resize-none"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  required={true}
                />
              </div>
            </label>
            <div className="flex justify-center items-center h-52">
              <button
                type="submit"
                className="bg-gray-500 w-44 h-14 text-white text-3xl rounded-3xl"
              >
                Add Note
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
