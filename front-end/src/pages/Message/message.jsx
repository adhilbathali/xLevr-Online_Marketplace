import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { Send, Smile, FileText, MessageSquare, Mic } from "lucide-react";
import style from "./message.module.css"; 

// Connect to Socket.IO server
const socket = io();

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => socket.off("chat message");
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (input.trim()) {
      const messageData = {
        text: input,
        timestamp: new Date().toLocaleTimeString(),
        isMine: true,
        type: "text",
      };
      setMessages((prev) => [...prev, messageData]);
      socket.emit("chat message", { ...messageData, isMine: false });
      setInput("");
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileData = {
          content: reader.result,
          name: file.name,
          timestamp: new Date().toLocaleTimeString(),
          isMine: true,
          type: "file",
        };
        setMessages((prev) => [...prev, fileData]);
        socket.emit("chat message", { ...fileData, isMine: false });
        setFile(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      setRecording(true);

      const audioChunks = [];
      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        const audioURL = URL.createObjectURL(audioBlob);

        const voiceMessage = {
          content: audioURL,
          timestamp: new Date().toLocaleTimeString(),
          isMine: true,
          type: "audio",
        };
        setMessages((prev) => [...prev, voiceMessage]);
        socket.emit("chat message", { ...voiceMessage, isMine: false });
        setRecording(false);
      };

      recorder.start();
    });
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setMediaRecorder(null);
  };

  return (
    <div className={style.container}>
      <h2 className={style.header}>
        <MessageSquare style={{ marginRight: "8px" }} /> Real-Time Chat
      </h2>
      <div className={style.chatBox}>
        <ul className={style.messageList}>
          {messages.map((msg, index) => (
            <li
              key={index}
              className={`${style.messageItem} ${msg.isMine ? style.myMessage : ""}`}
            >
              <span className={style.timestamp}>{msg.timestamp}</span>
              {msg.type === "text" && msg.text}
              {msg.type === "file" && (
                <a href={msg.content} download={msg.name} style={{ color: "#007bff" }}>
                  {msg.name}
                </a>
              )}
              {msg.type === "audio" && (
                <audio controls>
                  <source src={msg.content} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
              )}
            </li>
          ))}
          <div ref={messagesEndRef} />
        </ul>
      </div>

      <form className={style.form} onSubmit={handleSubmit}>
        <button type="button" className={style.iconButton} title="Emoji (Coming soon)">
          <Smile />
        </button>
        <input
          className={style.input}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          autoComplete="off"
        />
        <input
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="file-input"
        />
        <label htmlFor="file-input" className={style.iconButton} title="Attach File">
          <FileText />
        </label>
        <button
          type="button"
          className={style.iconButton}
          title={recording ? "Stop Recording" : "Record Voice Message"}
          onClick={recording ? stopRecording : startRecording}
        >
          <Mic />
        </button>
        <button className={style.iconButton} type="submit" title="Send">
          <Send />
        </button>
      </form>
    </div>
  );
};

export default Chat;