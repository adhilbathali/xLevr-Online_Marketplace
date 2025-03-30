import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Connect to the Socket.IO server
const socket = io();

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "16px",
    backgroundColor: "#f9f9f9",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  chatBox: {
    height: "300px",
    overflowY: "scroll",
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "10px",
    backgroundColor: "#fff",
  },
  messageList: {
    listStyle: "none",
    padding: 0,
  },
  messageItem: {
    marginBottom: "10px",
    wordWrap: "break-word",
  },
  timestamp: {
    color: "#888",
    fontSize: "0.9em",
  },
  form: {
    display: "flex",
    marginTop: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    marginRight: "10px",
    fontSize: "1em",
  },
  button: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
    fontSize: "1em",
  },
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    // Listen for incoming messages from the server
    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Cleanup listener on component unmount
    return () => {
      socket.off("chat message");
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const messageData = {
        text: input,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prevMessages) => [...prevMessages, messageData]); // Add the message to the screen
      socket.emit("chat message", messageData); // Send message to the server
      setInput(""); // Clear input field
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Real-Time Chat</h2>
      <div style={styles.chatBox}>
        <ul style={styles.messageList}>
          {messages.map((msg, index) => (
            <li key={index} style={styles.messageItem}>
              <span style={styles.timestamp}>{msg.timestamp}</span>: {msg.text}
            </li>
          ))}
        </ul>
      </div>
      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          style={styles.input}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          autoComplete="off"
        />
        <button style={styles.button} type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;