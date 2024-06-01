"use client";
import React from "react";
import { useState, useEffect, useMemo } from "react";
import AvatarCustom from "../Avatar/AvatarCustom";
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
import { set } from "mongoose";
export default function Task() {
  // Estados
  const [menuIconOpen, setMenuIconOpen] = useState(false);
  const [taskChecked, setTaskChecked] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [randomColor, setRandomColor] = useState("");
  const [data, setData] = useState([]);
  const [task, setTask] = useState("");
  const [changedTask, setChangedTask] = useState("");
  const [showForm, setShowForm] = useState("null");
  const menuIcon = menuIconOpen ? "rounded-2xl pl-4 pt-3 mt-1" : "hidden";
  useEffect(() => {
    // Verifica si estás en el navegador antes de acceder a localStorage
    if (typeof window !== "undefined") {
      const userIdFromLocalStorage = localStorage.getItem("userId");
      setUserId(userIdFromLocalStorage);
      setUsername(localStorage.getItem("username"));
      setRandomColor(localStorage.getItem("randomColor"));

      // Llama a la API después de que el userId se ha establecido
      fetch(`/api/tasks?userId=${userIdFromLocalStorage}`)
        .then((response) => response.json())
        .then((data) => {
          // Añade la propiedad 'checked' a cada tarea
          const tasksWithChecked = data.map((task) => ({
            ...task,
          }));
          setData(tasksWithChecked);
          setIsPageLoaded(true);
        });
    }
  }, []);
  // Funcion para editar una tarea
  const handleEdit = async (id) => {
    event.preventDefault();
    // Si el campo de la tarea está vacío, muestra un mensaje de error
    if (changedTask == "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        html: '<p style="color: #ffffff;">Something was wrong!</p>',
        footer: '<p style="color: #ffffff;">Task is empty</p>',
        confirmButtonText: "OK",
        confirmButtonColor: "#de6d6d",
        background: "#272727",
        customClass: {
          confirmButton: "sweet-alert-button",
          title: "sweet-alert-title",
          content: "sweet-alert-content",
        },
      }).then(() => {
        // Cierra el formulario de edición
        setShowForm(null);
      });
    } else {
      // Si el campo de la tarea no está vacío, actualiza la tarea
      try {
        const response = await fetch(`/api/tasks/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ task: changedTask }),
        });
        // Si hay un error, muestra un mensaje de error
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          Swal.fire({
            title: "Task updated successfully!",
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
            // Actualiza la tarea
            const updatedTask = { id, task: changedTask };
            const newData = data.map((task) =>
              task.id === id ? updatedTask : task
            );
            // Cierra el formulario de edición, actualiza la lista de tareas y limpia el campo de edición
            setShowForm(null);
            setData(newData);
            setChangedTask("");
          });
        }
        console.log(`Task: ${id} updated`);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  // Función para eliminar una tarea
  const handleDelete = async (id) => {
    event.preventDefault();
    // Llama a la API para eliminar la tarea
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      // Si hay un error, muestra un mensaje de error
      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          html: '<p style="color: #ffffff;">Something was wrong!</p>',
          footer: '<p style="color: #ffffff;">Task not found</p>',
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
        // Si la tarea se elimina correctamente, muestra un mensaje de éxito
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
          // Elimina la tarea de la lista de tareas
          const deleteTaskId = Number(id);
          const newData = data.filter((task) => task.id !== deleteTaskId);
          // Actualiza la lista de tareas
          setData(newData);
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // Función para añadir una tarea
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Llama a la API para añadir una tarea
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task, userId, checked: false }),
      });
      // Si hay un error, muestra un mensaje de error
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        // Si la tarea se añade correctamente, muestra un mensaje de éxito
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
          // Actualiza la lista de tareas y limpia el campo de tarea
          setData((prevData) => [...prevData, newTask]);
          setTask("");
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // Función para marcar o desmarcar una tarea
  const handleCheck = async (id) => {
    console.log(data);
    const taskToCheck = data.find((task) => Number(task.id) === id);
    if (!taskToCheck) {
      console.error(`Task with id ${id} not found`);
      return;
    }
    // Actualiza la tarea
    const updatedTask = { ...taskToCheck, checked: !taskToCheck.checked };
    // Llama a la API para actualizar la tarea
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });
      // Si hay un error, muestra un mensaje de error
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Aquí es donde se actualiza el estado con la tarea actualizada
      setData(
        data.map((task) => (Number(task.id) === id ? updatedTask : task))
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div
      id="padre"
      className="flex flex-col justify-center items-center h-screen"
    >
      <AvatarCustom />
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
          {menuIconOpen && (
            <Menu
              id="menu"
              className="rounded-2xl pl-4 pt-3 mt-1"
              onClose={() => setMenuIconOpen(false)} 
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
              <MenuItem className="mt-4 text-lg">
                <a href="/">
                  <button>Log out</button>
                </a>
              </MenuItem>
            </Menu>
          )}
        </Dropdown>
      </div>
      <div
        id="taskBackground"
        className="rounded-3xl flex flex-col justify-between h-full"
      >
        <div
          id=" taskArea"
          className="w-full overflow-auto mt-4 flex flex-col items-center  hide-scrollbar"
        >
          {data.map((task) => (
            <div
              key={task.id}
              id="task"
              className=" h-max mt-6 w-972 rounded-3xl pl-4 pt-1 text-xl relative break-words"
            >
              <div
                id="taskText"
               
              >
                <div className="w-full">
                  {task.task && (
                    <button
                      onClick={() => handleCheck(task.id)}
                      className="absolute left-0 top-0 ml-3"
                    >
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
                </div>
                <div
                 onClick={() =>
                  setShowForm(task.id === showForm ? null : task.id)
                }
                >
                 
                {showForm === task.id ? (
                  <div className="ml-7">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleEdit(task.id);
                      }}
                    >
                      <input
                        type="text"
                        value={changedTask}
                        onChange={(e) => setChangedTask(e.target.value)}
                        className="h-5 top-0 border-gray-300 focus:border-black focus:outline-none focus:border-2"
                        autoFocus
                        onBlur={() => setShowForm(null)}
                      />
                    </form>
                  </div>
                ) : (
                  <span className={task.checked ? "ml-8 line-through" : "ml-8"}>
                    {task.task}
                  </span>
                )}
                 
                 </div>
              </div>
              {task.task && (
                <button
                  onClick={() => handleDelete(task.id)}
                  className="absolute top-0 right-0 mr-4 "
                >
                  <DeleteIcon
                    sx={{ color: "gray", "&:hover": { color: "red" } }}
                  />
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="relative">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              id="inputTask"
              className="w-full rounded-b-3xl p-4 h-10 opacity-80 focus:border-black focus:outline-none focus:border-2 focus:opacity-100 input-placeholder"
              placeholder="Add a task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              required={true}
            />
            <button type="submit">
              <AddCircleOutlineIcon className="absolute right-2 bottom-2" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
