import React, { useState, useEffect, useRef } from "react";
import { Container, InputGroup, FormControl, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import Header from "./Header";

const Interview = () => {

  document.title = "AI Interview | Interview"

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typing, setTyping] = useState(false); 
  const messagesEndRef = useRef(null);

  const getChatContent = (chat) => {
    return chat.split("---")[0].trim();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchChatLogs = async () => {
      try {
        const authData = JSON.parse(localStorage.getItem("auth"));
        const accessToken = authData?.access;

        if (!accessToken) {
          throw new Error("No access token found");
        }

        const response = await axios.get(
          "http://127.0.0.1:8000/api/ai_interview/chatlog/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const chatLogs = response.data.map((log) => [
          { text: getChatContent(log.user_chat), sender: "user" },
          { text: getChatContent(log.ai_chat), sender: "ai" },
        ]).flat();

        setMessages(chatLogs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChatLogs();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
      const accessToken = authData?.access;

      if (!accessToken) {
        throw new Error("No access token found");
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: inputMessage, sender: "user" },
      ]);

      setTyping(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/ai_interview/ai/chat/",
        { message: inputMessage },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setTyping(false);

      const aiResponse = getChatContent(response.data.ai_interviewer);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: aiResponse, sender: "ai" },
      ]);

      setInputMessage("");
    } catch (err) {
      setTyping(false);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="sticky top-0 z-20">
        <Header />
      </div>

      <Container className="min-h-screen flex flex-col p-6 bg-gray-100">
        <div className="bg-white p-4 shadow-sm rounded-t-lg sticky top-10 z-10">
          <h2 className="text-xl font-bold text-gray-800">AI Interview Chat</h2>
        </div>

        <div className="flex-1 overflow-y-auto bg-white p-4 shadow-sm mt-2">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    message.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg max-w-[70%] ${
                      message.sender === "user"
                        ? "bg-gray-900 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="text-left mb-4">
                  <div className="inline-block p-3 rounded-lg bg-gray-200 text-gray-800">
                    <span className="typing-indicator">
                      Typing<span>.</span><span>.</span><span>.</span>
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="bg-white p-4 shadow-sm rounded-b-lg sticky bottom-0 z-10">
          <InputGroup>
            <FormControl
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="focus:outline-none focus:ring-0 focus:border-gray-300"
            />
            <Button
              variant="dark"
              onClick={handleSendMessage}
              className="bg-gray-900 hover:bg-blue-700 focus:outline-none focus:ring-0" 
            >
              Send
            </Button>
          </InputGroup>
        </div>
      </Container>
    </div>
  );
};

export default Interview;