import { useState } from "react";

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello! I am your Symptom Checker AI. I’ll ask a few questions to help identify your issue. Ready?" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    const userMessage = { role: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    const res = await fetch("http://localhost:5000/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [...messages, userMessage] })
    });

    const data = await res.json();
    setMessages(prev => [...prev, { role: "bot", text: data.reply }]);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="h-96 overflow-y-auto border rounded p-2 bg-white shadow">
        {messages.map((msg, i) => (
          <div key={i} className={`my-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
            <span className={`inline-block px-3 py-2 rounded ${msg.role === "user" ? "bg-blue-200" : "bg-gray-200"}`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex mt-2">
        <input
          className="flex-1 border p-2 rounded-l"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 rounded-r">
          Send
        </button>
      </div>
    </div>
  );
}
