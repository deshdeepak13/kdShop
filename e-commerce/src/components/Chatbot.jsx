import { useState } from "react";
import { FaComments, FaRobot, FaPaperPlane } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
  messages: [
    {
      role: "system",
      content: `You are a helpful, energetic...`, // (optional if handled backend)
    },
    ...messages.map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    })),
    {
      role: "user",
      content: input,
    },
  ],
}),

      });
      const data = await response.json();
      // setMessages([...newMessages, { sender: "bot", text: data.reply }]);
      const botMessages = data.replyChunks.map((chunk) => ({
        sender: "bot",
        text: chunk,
      }));
      setMessages([...newMessages, ...botMessages]);
    } catch {
      setMessages([
        ...newMessages,
        { sender: "bot", text: "Sorry, something went wrong." },
      ]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white p-5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 group ${
          !isOpen && "animate-bounce"
        }`}
        aria-label="Open Chatbot"
      >
        <FaComments
          size={28}
          className="transform group-hover:rotate-12 transition"
        />
        {/* {!isOpen && (<div 
  className="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-20 group-hover:opacity-30" 
  />)} */}
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 animate-fade-in-up">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl w-96 h-[500px] flex flex-col shadow-2xl border border-gray-700">
            {/* Header */}
            <div className="flex justify-between items-center p-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <FaRobot className="text-white text-xl" />
                <h2 className="text-white font-bold text-lg">kd.AI</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/10"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full space-y-2 opacity-70">
                  <FaRobot className="text-4xl text-gray-500 mb-4 animate-bounce" />
                  <p className="text-gray-400 text-center">
                    How can I help you today?
                  </p>
                  <p className="text-sm text-gray-500">
                    Ask me anything about our products!
                  </p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm transition-all duration-200 ${
                      msg.sender === "bot"
                        ? "bg-gray-700 text-gray-100 rounded-bl-none"
                        : "bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-br-none"
                    }`}
                    style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                  >
                    {msg.sender === "bot" ? (
                      <ReactMarkdown
                        components={{
                          strong: ({ children }) => (
                            <strong className="font-semibold">
                              {children}
                            </strong>
                          ),
                          em: ({ children }) => (
                            <em className="italic text-gray-300">{children}</em>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc ml-5">{children}</ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal ml-5">{children}</ol>
                          ),
                          li: ({ children }) => (
                            <li className="mb-1">{children}</li>
                          ),
                          p: ({ children }) => (
                            <p className="mb-2">{children}</p>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-blue-400 pl-3 italic text-gray-300">
                              {children}
                            </blockquote>
                          ),
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    ) : (
                      msg.text
                    )}

                    <div
                      className={`absolute w-3 h-3 -bottom-1 ${
                        msg.sender === "bot"
                          ? "left-0 bg-gray-700"
                          : "right-0 bg-blue-500"
                      }`}
                      style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-gray-800 rounded-b-2xl">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-900 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
                <button
                  onClick={sendMessage}
                  className="bg-gradient-to-br from-blue-500 to-purple-500 text-white p-3 rounded-xl hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <FaPaperPlane className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                AI assistant may sometimes provide inaccurate information
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
      `}</style>
    </>
  );
};

export default Chatbot;
