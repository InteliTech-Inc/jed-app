"use client";

import React, { useEffect, useState } from "react";

export default function NetworkStatus() {
  const [status, setStatus] = useState(navigator.onLine ? "online" : "offline");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setStatus("online");
      setVisible(true);
      setTimeout(() => setVisible(false), 2000);
    };

    const handleOffline = () => {
      setStatus("offline");
      setVisible(true);
    };

    setStatus(navigator.onLine ? "online" : "offline");
    setVisible(!navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const statusColor = {
    ellipse: status === "online" ? "bg-green-800 " : "bg-red-500",
    text: status === "online" ? "text-green-800 " : "text-red-800",
    container: status === "online" ? "bg-green-400 " : "bg-red-100",
  };

  return (
    <div
      className={`items-center md:flex ${statusColor.container} fixed bottom-0 z-50 w-screen justify-center space-x-2 px-4 py-1 transition-all duration-300 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <span
        className={`aspect-square w-2 rounded-full ${statusColor.ellipse}`}
      ></span>
      <p className={`${statusColor.text} text-sm capitalize`}>{status}</p>
    </div>
  );
}
