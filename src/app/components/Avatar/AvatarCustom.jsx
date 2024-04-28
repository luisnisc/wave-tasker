import React from "react";
import Avatar from "@mui/material/Avatar";
import { useState, useEffect } from "react";
import Image from "next/image";
export default function AvatarCustom() {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [randomColor, setRandomColor] = useState("");
  const userChar = username.charAt(0).toUpperCase();
  useEffect(() => {
    // Verifica si estás en el navegador antes de acceder a localStorage
    if (typeof window !== "undefined") {
      const userIdFromLocalStorage = localStorage.getItem("userId");
      setUserId(userIdFromLocalStorage);
      setUsername(localStorage.getItem("username"));
      setRandomColor(localStorage.getItem("randomColor"));
    }
  });
  return (
    <Avatar
      id="avatar"
      className="absolute top-0 left-0 m-5 scale-125"
      sx={{
        backgroundColor: randomColor,
      }}
    >
      {userId == 5 || userId == 3 ? (
        <Image
          src="/Eustaquio.jp"
          priority
          alt={userChar}
          width={62}
          height={62}
          objectFit="cover"
        />
      ) : (
        userChar
      )}
    </Avatar>
  );
}
