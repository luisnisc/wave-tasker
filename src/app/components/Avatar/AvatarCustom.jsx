import React from "react";
import Avatar from "@mui/material/Avatar";
import { useState, useEffect } from "react";
import Image from "next/image";
// Esta función hace que si el color de fondo del avatar es claro, la letra se muestre negra y si el color es oscuro, la letra se muestre clara
function isLight(color) {
  const BackgroundColor = color.substring(1); // quita el #
  const rgb = parseInt(BackgroundColor, 16); // convierte rrggbb a decimal
  const r = (rgb >> 16) & 0xff; // extrae el rojo
  const g = (rgb >> 8) & 0xff; // extrae el verde
  const b = (rgb >> 0) & 0xff; // extrae el azul

  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

  return luma > 128;
}
export default function AvatarCustom() {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [color, setColor] = useState("");
  const userChar = username.charAt(0).toUpperCase();

  useEffect(() => {
    // Verifica si estás en el navegador antes de acceder a localStorage
    if (typeof window !== "undefined") {
      const userIdFromLocalStorage = localStorage.getItem("userId");
      setUserId(userIdFromLocalStorage);
      setUsername(localStorage.getItem("username"));
      setColor(localStorage.getItem("color"));
    }
  });
  const textColor = isLight(color) ? "black" : "white";
  return (
    <Avatar
      id="avatar"
      className="absolute top-0 left-0 m-5 scale-125"
      sx={{
        backgroundColor: color,
        color: textColor,
      }}
    >
      {userChar}
    </Avatar>
  );
}
