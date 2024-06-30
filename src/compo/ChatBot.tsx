import React, { useState } from "react";

interface Message {
  message: string;
  type: "text" | "source";
  lang?: "en" | "ar" | "fr"; // Include "fr" for French
}

const ChatBot: React.FC<{ backendUrl: string }> = ({ backendUrl }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");

  const handleSendMessage = async () => {
    if (input.trim() !== "") {
      const userMessage = input;
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: userMessage, type: "text", lang: "en" },
      ]);
      setInput("");

      try {
        const response = await fetch(`${backendUrl}/query`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: userMessage }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        // Prepare messages array with English, Arabic, and French versions if available
        const englishMessage: Message = {
          message: `English Version: ${data.english_version}`,
          type: "text",
          lang: "en",
        };
        const arabicMessage: Message = {
          message: `Arabic Version: ${data.arabic_version}`,
          type: "text",
          lang: "ar",
        };
        const frenchMessage: Message = {
          message: `French Version: ${data.french_version || "Not available"}`,
          type: "text",
          lang: "fr",
        };

        const sourceMessage: Message = {
          message: `Source: ${data.source.source}`,
          type: "source",
        };

        setMessages((prevMessages) => [
          ...prevMessages,
          englishMessage,
          arabicMessage,
          frenchMessage,
          sourceMessage,
        ]);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { message: "Error: Could not reach the server", type: "text" },
        ]);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-700">
      <div className="flex-1 p-4 overflow-y-auto">
        <h2 className="text-2xl text-white mb-4">ChatBot</h2>
        <div className="flex flex-col gap-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                index % 2 === 0 ? "items-start" : "items-end justify-end"
              }`}
            >
              <div
                className={`rounded-lg ${
                  message.type === "source" ? "bg-gray-600" : "bg-gray-800"
                } p-2`}
              >
                <p
                  className={`text-white ${
                    message.type === "source" && "text-blue-400"
                  } ${message.lang === "ar" ? "rtl-text" : "ltr-text"}`}
                >
                  {message.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 bg-gray-800 flex items-center fixed bottom-0 w-full">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 bg-gray-900 text-white p-4 rounded-l"
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <button
          className="ml-2 bg-green-500 text-white p-2 rounded-r"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
