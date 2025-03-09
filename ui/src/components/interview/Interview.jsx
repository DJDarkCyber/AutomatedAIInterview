import React, { useState, useEffect } from "react";
import { Container, InputGroup, FormControl, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import Header from "./Header";

const Interview = () => {
  const [messages, setMessages] = useState([]); // Stores chat messages
  const [inputMessage, setInputMessage] = useState(""); // Stores the current input message
  const [loading, setLoading] = useState(true); // Loading state for fetching chat logs
  const [error, setError] = useState(null); // Error state

  // Function to split chat content by "---" and return the first part
  const getChatContent = (chat) => {
    return chat.split("---")[0].trim(); // Split by "---" and take the first part
  };

  // Fetch previous chat logs when the component loads
  useEffect(() => {
    const fetchChatLogs = async () => {
      try {
        const authData = JSON.parse(localStorage.getItem("auth"));
        const accessToken = authData?.access;

        if (!accessToken) {
          throw new Error("No access token found");
        }

        // Fetch previous chat logs
        const response = await axios.get(
          "http://127.0.0.1:8000/api/ai_interview/chatlog/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Map the fetched chat logs to the messages state
        const chatLogs = response.data.map((log) => [
          { text: getChatContent(log.user_chat), sender: "user" },
          { text: getChatContent(log.ai_chat), sender: "ai" },
        ]).flat(); // Flatten the array to match the messages structure

        setMessages(chatLogs); // Set the fetched chat logs
      } catch (err) {
        setError(err.message); // Set error message
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchChatLogs();
  }, []);

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
      const accessToken = authData?.access;

      if (!accessToken) {
        throw new Error("No access token found");
      }

      // Add user's message to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: inputMessage, sender: "user" },
      ]);

      // Send the user's message to the AI
      const response = await axios.post(
        "http://127.0.0.1:8000/api/ai_interview/ai/chat/",
        { message: inputMessage },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Add AI's response to the chat (only the first part before "---")
      const aiResponse = getChatContent(response.data.ai_interviewer);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: aiResponse, sender: "ai" },
      ]);

      // Clear the input field
      setInputMessage("");
    } catch (err) {
      setError(err.message); // Set error message
    }
  };

  return (
    <Container className="min-h-screen flex flex-col p-6 bg-gray-100">
      {/* Chat Header */}
      <Header />
      <div className="bg-white p-4 shadow-sm rounded-t-lg">
        <h2 className="text-xl font-bold text-gray-800">AI Interview Chat</h2>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto bg-white p-4 shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.sender === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block p-3 rounded-lg max-w-[70%] ${
                  message.sender === "user"
                    ? "bg-blue-600 text-gray"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Chat Input Area */}
      <div className="bg-white p-4 shadow-sm rounded-b-lg">
        <InputGroup>
          <FormControl
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button
            variant="primary"
            onClick={handleSendMessage}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Send
          </Button>
        </InputGroup>
      </div>
    </Container>
  );
};

export default Interview;