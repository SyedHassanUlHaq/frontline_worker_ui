import React, { useState, useRef, useEffect } from "react";
import ChatWindow from "./components/ChatWindow";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <ChatWindow />
    </div>
  );
}
