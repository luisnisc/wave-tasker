"use client";
import React from "react";
import { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Dropdown } from "@mui/base/Dropdown";
import { MenuButton } from "@mui/base/MenuButton";
import { Menu } from "@mui/base/Menu";
import { MenuItem } from "@mui/base/MenuItem";

import "../../../../styles/Task.css";
export default function Task() {
  const [menuIconOpen, setMenuIconOpen] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

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
        <Dropdown className="">
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
              <a href="">
                <button>Calendar</button>
              </a>
            </MenuItem>
            <MenuItem className="mt-4 text-lg">
              <a href="">
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
        <form action="">
          <div>
            <input
              type="text"
              id="inputTask"
              className="absolute w-full bottom-0 rounded-b-3xl p-4 h-10 focus:border-black focus:outline-none focus:border-2"
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
