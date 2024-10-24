import React from 'react';
import { IoIosSend } from "react-icons/io";
import { FaAirbnb } from "react-icons/fa";



const Chatbot = () => {
  const suggestions = [
    {
      title: "Come up with concepts",
      subtitle: "for a retro-style arcade game"
    },
    {
      title: "Give me ideas",
      subtitle: "for what to do with my kids' art"
    },
    {
      title: "Design a database schema",
      subtitle: "for an online merch store"
    },
    {
      title: "Recommend activities",
      subtitle: "for a team-building day with remote employees"
    }
  ];

  return (
    <div className="min-h-screen  flex flex-col items-center p-4 w-full rounded-tl-2xl ">
      {/* Logo and Header */}
      <div className="flex flex-col items-center mb-8 mt-16">
        <FaAirbnb className="w-12 h-12 text-white mb-2" />
        <h1 className="text-white text-3xl font-semibold">How can I help you today?</h1>
      </div>

      {/* Suggestion Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mb-8">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors text-left"
          >
            <p className="text-white font-medium mb-1">{suggestion.title}</p>
            <p className="text-gray-400">{suggestion.subtitle}</p>
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="w-full max-w-4xl relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Message ChatGPT..."
            className="w-full bg-gray-800 text-white rounded-xl py-4 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-gray-700"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2">
            <IoIosSend className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        <p className="text-gray-500 text-sm text-center mt-4">
          ChatGPT can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
};

export default Chatbot;