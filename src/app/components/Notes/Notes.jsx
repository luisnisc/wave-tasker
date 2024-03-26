"use client";
import React from "react";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { Dropdown } from "@mui/base/Dropdown";
import { MenuButton } from "@mui/base/MenuButton";
import { Menu } from "@mui/base/Menu";
import { MenuItem } from "@mui/base/MenuItem";

import "../../../../styles/Notes.css";

export default function Notes(initialData) {
  const [data, setData] = useState([initialData]);
  const [menuIconOpen, setMenuIconOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const handleDelete = async (id) => {
    event.preventDefault();

    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          html: '<p style="color: #ffffff;">Something was wrong!</p>',
          footer: '<p style="color: #ffffff;">Note not found</p>',
          confirmButtonText: "OK",
          confirmButtonColor: "#de6d6d",
          background: "#272727",
          customClass: {
            confirmButton: "sweet-alert-button",
            title: "sweet-alert-title",
            content: "sweet-alert-content",
          },
        });
      } else {
        console.log(`Note: ${id} deleted`);

        Swal.fire({
          title: "Note deleted successfully!",
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
          const deleteNoteId = Number(id);
          const newData = data.filter((note) => note.id !== deleteNoteId);
          setData(newData);
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
    fetch(`/api/notes?userId=${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, [userId]);


  return (
    <div
      id="padre"
      className="flex justify-center h-full "
    >
      <div className="fixed w-full">
        <Avatar
          id="avatar"
          className={`absolute top-0 left-0 m-5 scale-125`}
          src="/Eustaquio.jpg"
        />
        <div className="absolute top-0 right-0 m-5 text-4xl mr-7">
          <a href="/add-note-form">
            <button>
              <AddCircleIcon
                sx={{ color: "white" }}
                className="text-4xl mr-4"
              />
            </button>
          </a>
          <Dropdown>
            <MenuButton onClick={() => setMenuIconOpen(!menuIconOpen)}>
              {menuIconOpen ? (
                <CloseIcon
                  className="text-4xl"
                  sx={{ color: "white" }}
                />
              ) : (
                <MenuIcon
                  className="text-4xl"
                  sx={{ color: "white" }}
                />
              )}
            </MenuButton>
            <Menu
              id="menu"
              className="rounded-2xl pl-4 pt-3 mt-1"
            >
              <MenuItem className="text-lg">
                <a href="/task">
                  <button>Task</button>
                </a>
              </MenuItem>
              <MenuItem className="mt-4 text-lg">
                <a href="/calendar">
                  <button>Calendar</button>
                </a>
              </MenuItem>
              <MenuItem className="mt-4 text-lg">
                <a href="/notes">
                  <button>Notes</button>
                </a>
              </MenuItem>
            </Menu>
          </Dropdown>
        </div>
      </div>
      <div
        id="NotesArea"
        className="rounded-3xl grid grid-cols-4 gap-14 gap-y-14 mt-28 "
      >
        {data.map((note) => (
          <div
            key={note.id}
            id="noteExample"
            className="rounded-3xl"
          >
            <div className="relative">
              <button
                onClick={() => handleDelete(note.id)}
                className="absolute right-0 mr-4 mt-1"
              >
                <DeleteIcon
                  sx={{
                    color: "gray",
                    "&:hover": {
                      color: "red",
                    },
                  }}
                />
              </button>
            </div>
            <div className="text-4xl mt-8 mx-3">
              <h1>{note.title}</h1>
            </div>
            <div className="mt-5 ml-4 overflow-y-auto break-words whitespace-pre-wrap max-h-[200px] hide-scrollbar pr-3">
              <p>{note.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
