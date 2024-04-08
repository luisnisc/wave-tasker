"use client";
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

moment.updateLocale("es", { week: { dow: 1 } });
const localizer = momentLocalizer(moment);
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
    <div style={toolbarStyle}>
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

export default function MyCalendar() {
  const [date, setDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [hour, setHour] = useState("");
  const [event, setEvent] = useState("");
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [randomColor, setRandomColor] = useState("");
  const [menuIconOpen, setMenuIconOpen] = useState(false);

  useEffect(() => {
    // Verifica si estás en el navegador antes de acceder a localStorage
    if (typeof window !== "undefined") {
      const userIdFromLocalStorage = localStorage.getItem("userId");
      setUserId(userIdFromLocalStorage);
      setUsername(localStorage.getItem("username"));
      setRandomColor(localStorage.getItem("randomColor"));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newEvent = {
      title: event,
      start: selectedDate,
      end: selectedDate,
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);
    setShowForm(false);
  };
  console.log(showForm);
  return (
    <div id="padre">
      <Avatar
        id="avatar"
        className="absolute top-0 left-0 m-5 scale-125"
        sx={{
          backgroundColor: randomColor,
        }}
      >
        {username.charAt(0).toUpperCase()}
      </Avatar>
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
            selectable={true}
            onSelectEvent={(event) => {
              console.log("Event selected:", event);
              setSelectedDate(event.start);
              setShowForm(true);
            }}
            onSelectSlot={(slotInfo) => {
              console.log("Slot selected:", slotInfo.start);
              setSelectedDate(slotInfo.start);
              setShowForm(true);
            }}
          />
          {showForm && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1,
              }}
            />
          )}
          {showForm && (
            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "white",
                padding: "20px",
                zIndex: 2,
              }}
            >
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="event">Event</label>
                  <input
                    type="text"
                    id="event"
                    value={event}
                    onChange={(e) => setEvent(e.target.value)}
                  />
                </div>
                <button type="submit">Add Event</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
