import React, { useState, useEffect, useRef } from "react"; // Added useRef
import { io } from "socket.io-client";
import "./App.css";

const CONNECTION_PORT = "http://localhost:3002";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [room, setRoom] = useState("");
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const socketRef = useRef(null); // Create a ref for the socket instance

  useEffect(() => {
    socketRef.current = io(CONNECTION_PORT); // Assign socket instance to ref
    console.log("Socket connected");

    socketRef.current.on("receive_message", (data) => {
      setMessageList((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socketRef.current.disconnect(); // Clean up the socket connection on unmount
    };
  }, []);

  const connectToRoom = () => {
    setLoggedIn(true);
    socketRef.current.emit("join_room", room); // Use socketRef.current
  };

  const sendMessage = () => {
    const messageContent = {
      room,
      content: {
        author: userName,
        message,
      },
    };

    socketRef.current.emit("send_message", messageContent); // Use socketRef.current
    setMessageList((prevMessages) => [...prevMessages, messageContent.content]);
    setMessage("");
  };

  return (
    <div className="App">
      {!loggedIn ? (
        <div className="logIn">
          <div className="inputs">
            <input
              type="text"
              placeholder="Name..."
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Room..."
              onChange={(e) => setRoom(e.target.value)}
            />
          </div>
          <button onClick={connectToRoom}>Enter Chat</button>
        </div>
      ) : (
        <div className="chatContainer">
          <div className="messages">
            {messageList.map((val, key) => (
              <div
                key={key} // Added unique key prop for better rendering performance
                className="messageContainer"
                id={val.author === userName ? "You" : "Other"}
              >
                <div className="messageIndividual">
                  {val.author}: {val.message}
                </div>
              </div>
            ))}
          </div>
          <div className="messageInputs">
            <input
              type="text"
              placeholder="Message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)} // Two-way binding
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
