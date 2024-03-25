"use client";
import React from "react";
import { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Swal from "sweetalert2";
import { Dropdown } from "@mui/base/Dropdown";
import { MenuButton } from "@mui/base/MenuButton";
import { Menu } from "@mui/base/Menu";
import { MenuItem } from "@mui/base/MenuItem";

import "../../../../styles/Task.css";
export default function Task() {
  const [menuIconOpen, setMenuIconOpen] = useState(false);
  const [taskChecked, setTaskChecked] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [task, setTask] = useState("");
  const handleDelete = async (id) => {
    event.preventDefault();

    try {
      const response = await fetch(`/api/tasks/${id}`, {
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
        console.log(`Task: ${id} deleted`);

        Swal.fire({
          title: "Task deleted successfully!",
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
          const deleteTaskId = Number(id);
          const newData = data.filter((task) => task.id !== deleteTaskId);
          setData(newData);
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
    /**
     * Realiza una llamada a la API para obtener los datos de la tabla.
     * Se ejecuta una vez al cargar el componente.
     */
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        console.log("Task: " + task + " añadido");
        const newTask = await response.json();
        console.log(newTask);

        Swal.fire({
          title: "Task added successfully!",
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
          setData((prevData) => [...prevData, newTask]);
          setTask("");
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleCheck = (id) => {
    setData(data.map(task => task.id === id ? { ...task, checked: !task.checked } : task));
  };
  useEffect(() => {
    fetch("/api/tasks/")
      .then((response) => response.json())
      .then((data) => {
        // Añade la propiedad 'checked' a cada tarea
        const tasksWithChecked = data.map(task => ({ ...task, checked: false }));
        setData(tasksWithChecked);
        setIsPageLoaded(true);
      });
  }, []);
  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  return (
    <div
      id="padre"
      className="flex justify-center items-center h-screen"
    >
      <Avatar
        id="avatar"
        className={`absolute top-0 left-0 m-5 scale-125 ${
          isPageLoaded ? "visible" : "invisible"
        }`}
        src="/Eustaquio.jpg"
      />
      <div className="absolute top-0 right-0 m-5 text-4xl mr-7">
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
      <div
        id="taskBackground"
        className="rounded-3xl relative"
      >
        <div
          id=" taskArea"
          className="w-full flex flex-col items-center mt-4"
        >
          {data.map((task) => (
            <div
              id="task"
              className=" h-9 mt-6 w-972 rounded-3xl pl-4 pt-1 text-xl relative"
            >
              <div id="taskText">
                {task.task && (
                  <button onClick={() => handleCheck(task.id)}>
                    {task.checked ? (
                      <CheckBoxIcon
                        className=""
                        sx={{ color: "gray" }}
                      />
                    ) : (
                      <CheckBoxOutlineBlankIcon
                        className=""
                        sx={{ color: "gray" }}
                      />
                    )}
                  </button>
                )}
                <span className={task.checked ? "ml-8 line-through" : "ml-8"}>
                  {task.task}
                </span>
                {task.task && (
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="absolute right-0 mr-4 "
                  >
                    <DeleteIcon
                      sx={{ color: "gray", "&:hover": { color: "red" } }}
                    />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              id="inputTask"
              className="absolute w-full bottom-0 rounded-b-3xl p-4 h-10 focus:border-black focus:outline-none focus:border-2"
              placeholder="Add a task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
            <button type="submit">
              <AddCircleOutlineIcon className="absolute right-2 bottom-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
