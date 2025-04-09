import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom"; // For dynamic clientId from the URL
import { Send, Smile, FileText, MessageSquare, Mic, StopCircle } from "lucide-react";
import style from "./message.module.css";

// Connect to Socket.IO server
const socket = io();

const Chat = () => {
  const { clientId } = useParams(); // Retrieve clientId dynamically from the URL
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingTimer, setRecordingTimer] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Join a private room for the specific clientId
    if (clientId) {
      socket.emit("join room", clientId);

      // Listen for incoming messages in the room
      socket.on("chat message", (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    }

    return () => {
      // Leave the room when the component unmounts
      if (clientId) {
        socket.emit("leave room", clientId);
        socket.off("chat message");
      }
    };
  }, [clientId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Timer logic for recording
  useEffect(() => {
    let timer;
    if (recording) {
      timer = setInterval(() => {
        setRecordingTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timer);
      setRecordingTimer(0);
    }
    return () => clearInterval(timer);
  }, [recording]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (input.trim()) {
      const messageData = {
        text: input,
        timestamp: new Date().toLocaleTimeString(),
        isMine: true,
        type: "text",
        clientId, // Include clientId for private communication
      };
      setMessages((prev) => [...prev, messageData]);
      socket.emit("private message", messageData); // Send to server
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
          clientId,
        };
        setMessages((prev) => [...prev, fileData]);
        socket.emit("private message", fileData);
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
          clientId,
        };
        setMessages((prev) => [...prev, voiceMessage]);
        socket.emit("private message", voiceMessage);
        setRecording(false);
      };

      recorder.start();
    });
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setMediaRecorder(null);
    setRecording(false);
  };

  return (
    <div className={style.container}>
      <h2 className={style.header}>
        <MessageSquare style={{ marginRight: "8px" }} /> Private Chat
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

      {recording && (
        <div className={style.recordingIndicator}>
          <span>Recording... {recordingTimer}s</span>
          <StopCircle
            size={24}
            color="red"
            onClick={stopRecording}
            style={{ cursor: "pointer" }}
          />
        </div>
      )}

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