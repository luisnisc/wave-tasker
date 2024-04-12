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
import AvatarCustom from "../Avatar/AvatarCustom";

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
  const [hour, setHour] = useState("");
  const [event, setEvent] = useState("");
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [randomColor, setRandomColor] = useState("");
  const [menuIconOpen, setMenuIconOpen] = useState(false);
  const [events, setEvents] = useState([]);
  useEffect(() => {
    // Verifica si estás en el navegador antes de acceder a localStorage
    if (typeof window !== "undefined") {
      const userIdFromLocalStorage = localStorage.getItem("userId");
      setUserId(userIdFromLocalStorage);
      setUsername(localStorage.getItem("username"));
      setRandomColor(localStorage.getItem("randomColor"));
  
      // Carga los eventos desde localStorage
      const eventsFromLocalStorage = localStorage.getItem("events");
      if (eventsFromLocalStorage) {
        const parsedEvents = JSON.parse(eventsFromLocalStorage);
        // Convierte las fechas de inicio y fin a objetos Date
        const eventsWithDates = parsedEvents.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
        setEvents(eventsWithDates);
      }
    }
  }, []);

  const handleSubmit = (e) => {
  e.preventDefault();
  const [hours, minutes] = hour.split(":").map(Number);
  
  // Verifica que 'selectedDate' es un objeto Date válido
  if (Object.prototype.toString.call(selectedDate) === "[object Date]") {
    if (isNaN(selectedDate.getTime())) {  // selectedDate no es una fecha válida
      console.error("selectedDate is not a valid Date object");
      return;
    }
  } else {  // selectedDate no es un objeto Date
    console.error("selectedDate is not a Date object");
    return;
  }

  const start = new Date(selectedDate);
  start.setUTCHours(hours, minutes);
  const end = new Date(start);
  end.setUTCHours(start.getUTCHours() + 1);

  const newEvent = {
    title: event,
    start: start,
    end: end,
  };

  // Actualiza el estado y almacena los eventos en localStorage
  setEvents((prevEvents) => {
    const updatedEvents = [...prevEvents, newEvent];
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    return updatedEvents;
  });

  setShowForm(false);
};
  const handleSelectEvent = (event) => {
    setSelectedDate(event.start);
    setShowForm(true);
  };
  const handleSelectSlot = (slotInfo) => {
    console.log(slotInfo);
  
    // Extrae la fecha y la hora de slotInfo.start
    const year = slotInfo.start.getFullYear();
    const month = slotInfo.start.getMonth();
    const date = slotInfo.start.getDate();
    const hours = slotInfo.start.getHours();
    const minutes = slotInfo.start.getMinutes();
  
    // Construye un nuevo objeto Date con la fecha y la hora locales
    const localDate = new Date(year, month, date, hours, minutes);
    
    setSelectedDate(localDate);
    setShowForm(true);
    console.log(localDate)
  };
  
  
  return (
    <div id="padre">
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
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable={true}
            onDrillDown={(date) => {
              setSelectedDate(date);
              setShowForm(true);
            }}

          />
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
