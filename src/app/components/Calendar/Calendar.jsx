'use client';
import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Avatar from "@mui/material/Avatar";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Dropdown } from "@mui/base/Dropdown";
import { MenuButton } from "@mui/base/MenuButton";
import { Menu } from "@mui/base/Menu";
import { MenuItem } from "@mui/base/MenuItem";
import "../../../../styles/Calendar.css";
import AvatarCustom from "../Avatar/AvatarCustom";

moment.updateLocale("es", { week: { dow: 1 } });
const localizer = momentLocalizer(moment);

// Esta función es para hacer la barra de navegación del calendario
function CustomToolbar({ date, setDate }) {
  const navigate = (action) => {
    switch (action) {
      case "PREV":
        setDate(new Date(date.setMonth(date.getMonth() - 1)));
        break;
      case "NEXT":
        setDate(new Date(date.setMonth(date.getMonth() + 1)));
        break;
      default:
        break;
    }
  };

  const toolbarStyle = {
    display: "flex",
    justifyContent: "space-between",
    width: "max-content",
    color: "white",
  };

  const buttonStyle = {
    color: "white",
  };

  return (
    <div style={toolbarStyle} >
      <button
        style={buttonStyle}
        onClick={() => navigate("PREV")}
      >
        <ArrowBackIosIcon />
      </button>
      <span>{moment(date).format("MMMM YYYY")}</span>
      <button
        style={buttonStyle}
        onClick={() => navigate("NEXT")}
      >
        <ArrowForwardIosIcon />
      </button>
    </div>
  );
}
// Esta función es para el calendario en sí, es de la utilidad react-big-calendar
export default function MyCalendar() {
  const [date, setDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [hour, setHour] = useState("");
  const [event, setEvent] = useState("");
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [randomColor, setRandomColor] = useState("");
  const [menuIconOpen, setMenuIconOpen] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userIdFromLocalStorage = localStorage.getItem("userId");
      setUserId(userIdFromLocalStorage);
      setUsername(localStorage.getItem("username"));
      setRandomColor(localStorage.getItem("randomColor"));
    }
  }, []);

  return (
    <div id="padre" className="select-none">
      <AvatarCustom/>
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
            <MenuItem className="mt-4 text-lg">
              <a href="/">
                <button>Log out</button>
              </a>
            </MenuItem>
          </Menu>
        </Dropdown>
      </div>
      <div
        id="calendarContainer"
        style={{ position: "relative" }}
      >
        <div
          className="grid grid-cols-7 rounded-calendar"
          id="calendar"
        >
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            culture="es"
            date={date}
            onNavigate={(newDate) => setDate(newDate)}
            components={{
              toolbar: (props) => (
                <CustomToolbar
                  {...props}
                  date={date}
                  setDate={setDate}
                />
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
}