import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import axios from 'axios'

const ChatPage = ({ user }) => {
  const messagesEndRef = useRef(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Fetch the last 20 messages from the server
    const fetchMessages = async () => {
        try {
            const response = await axios.get('https://whatsay-backend.onrender.com/messages');
            console.log(response);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    // Connect to the server
    const newSocket = io("https://whatsay-backend.onrender.com");
    setSocket(newSocket);

    // Request permission for notifications
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // Listen for incoming messages
    newSocket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);

      // Display notification if app is not focused
      if (!document.hasFocus()) {
        showNotification(message);
      }
    });

    return () => {
      // Disconnect from the server when component unmounts
      newSocket.disconnect();
    };
  }, []);

  const getTimeDifference = (previousTime) => {
    const currentTime = new Date();
    const oldTime = new Date(previousTime)
    const difference = Math.round(
      (currentTime - oldTime) / (1000 * 60 * 60 * 24)
    ); // Difference in days

    if (difference < 1) {
      return "today";
    } else if (difference === 1) {
      return "yesterday";
    } else if (difference < 7) {
      return `${difference} days ago`;
    } else if (difference < 30) {
      return `${Math.floor(difference / 7)} week${
        Math.floor(difference / 7) === 1 ? "" : "s"
      } ago`;
    } else if (difference < 365) {
      return `${Math.floor(difference / 30)} month${
        Math.floor(difference / 30) === 1 ? "" : "s"
      } ago`;
    } else {
      return `${Math.floor(difference / 365)} year${
        Math.floor(difference / 365) === 1 ? "" : "s"
      } ago`;
    }
  };

  const sendMessage = (msg) => {
    if (messageInput.trim() !== "") {
      // Send the message to the server
      socket.emit("message", msg);

      // Clear the message input field
      setMessageInput("");
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const showNotification = (message) => {
    if (Notification.permission === "granted") {
      new Notification(`${message.name} sent a new message`, {
        body: message.message,
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="mockup-phone border-primary h-[90vh] w-[20rem] overflow-y-scroll">
        <div className="camera"></div>
        <div className="display px-2 relative">
          <div className="w-5 h-8"></div>
          {messages.map((msg, index) => (
            <div
              className={`chat ${
                msg.name === user ? "chat-end" : "chat-start"
              }`}
              key={index}
            >
              <div className="chat-header">
                {msg.name === user ? "You" : msg.name}
                <time className="text-xs opacity-50">
                  {" "}
                  {getTimeDifference(msg.time)}
                </time>
              </div>
              <div className="chat-bubble">{msg.message}</div>
            </div>
          ))}
          {/* Empty div used as reference to scroll to */}
          <div ref={messagesEndRef} />
        </div>
        <div className="fixed bottom-0 flex space-x-1">
          {/* Input and button components... */}
          <input
            type="text"
            placeholder="Type a message"
            className="input input-bordered input-accent w-full max-w-xs"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button
            className="btn btn-success btn-square"
            onClick={() =>
              sendMessage({
                name: user,
                time: Date.now(),
                message: messageInput,
              })
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                xmlns="http://www.w3.org/2000/svg"
                d="M3.78963301,2.77233335 L24.8609339,12.8499121 C25.4837277,13.1477699 25.7471402,13.8941055 25.4492823,14.5168992 C25.326107,14.7744476 25.1184823,14.9820723 24.8609339,15.1052476 L3.78963301,25.1828263 C3.16683929,25.4806842 2.42050372,25.2172716 2.12264586,24.5944779 C1.99321184,24.3238431 1.96542524,24.015685 2.04435886,23.7262618 L4.15190935,15.9983421 C4.204709,15.8047375 4.36814355,15.6614577 4.56699265,15.634447 L14.7775879,14.2474874 C14.8655834,14.2349166 14.938494,14.177091 14.9721837,14.0981464 L14.9897199,14.0353553 C15.0064567,13.9181981 14.9390703,13.8084248 14.8334007,13.7671556 L14.7775879,13.7525126 L4.57894108,12.3655968 C4.38011873,12.3385589 4.21671819,12.1952832 4.16392965,12.0016992 L2.04435886,4.22889788 C1.8627142,3.56286745 2.25538645,2.87569101 2.92141688,2.69404635 C3.21084015,2.61511273 3.51899823,2.64289932 3.78963301,2.77233335 Z"
                id="🎨-Color"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
