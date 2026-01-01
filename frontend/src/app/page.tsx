"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function TodoApp() {
  const [tasks, setTasks] = useState<{ id: number; title: string; description?: string }[]>([]);
  const [prompt, setPrompt] = useState("");
  const [chatLog, setChatLog] = useState<{ msg: string; role: string }[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. Database se tasks load karne ka function
  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Tasks load nahi ho sakay");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 2. AI Chat function (Sir Taha Style)
  const handleChat = async () => {
    if (!prompt) return;
    const userMsg = prompt;
    setPrompt("");
    setLoading(true);
    setChatLog((prev) => [...prev, { msg: userMsg, role: "user" }]);

    try {
      const res = await axios.post("http://127.0.0.1:8000/chat", { prompt: userMsg });
      setChatLog((prev) => [...prev, { msg: res.data.ai_response, role: "ai" }]);
      fetchTasks(); // Database refresh
    } catch (err) {
      setChatLog((prev) => [...prev, { msg: "Error: Backend se raabta nahi hua.", role: "ai" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-10 font-sans text-black relative">
      <div className="max-w-4xl mx-auto">
        {/* Title hamesha black hona chahiye */}
        <h1 className="text-4xl font-bold mb-8 text-black border-b-2 border-blue-600 pb-2">
          Rabia's AI Todo Agent 🤖
        </h1>
        
        {/* Main Task List Dashboard */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-black mb-4">Your Task List:</h2>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div key={task.id} className="bg-gray-100 p-5 rounded-xl shadow-md border-2 border-gray-200 flex items-center gap-4">
                <input type="checkbox" className="w-6 h-6 accent-blue-600" />
                <div>
                  {/* Task title aur description dono black hain */}
                  <p className="text-xl font-bold text-black">{task.title}</p>
                  {task.description && <p className="text-md text-gray-700">{task.description}</p>}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 italic">No tasks yet. Ask the assistant to add something!</p>
          )}
        </div>
      </div>

      {/* Floating AI Assistant (Sir Taha Style) */}
      <div className="fixed bottom-10 right-10 w-96 bg-white shadow-2xl rounded-2xl overflow-hidden border-2 border-blue-600 flex flex-col">
        {/* Blue Header */}
        <div className="bg-blue-600 p-4 text-white font-extrabold flex justify-between items-center">
          <span className="text-lg">AI Todo Assistant</span>
          <span className="text-2xl cursor-pointer">×</span>
        </div>
        
        {/* Chat History Area */}
        <div className="h-80 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4">
          {chatLog.map((chat, i) => (
            <div 
              key={i} 
              className={`p-3 rounded-2xl text-md max-w-[85%] font-medium shadow-sm ${
                chat.role === 'user' 
                ? 'bg-blue-600 text-white self-end' 
                : 'bg-white text-black border-2 border-gray-200 self-start'
              }`}
            >
              {chat.msg}
            </div>
          ))}
          {loading && <p className="text-sm text-blue-500 animate-bounce">Assistant is typing...</p>}
        </div>

        {/* Input Area - SPECIALLY FIXED BLACK TEXT */}
        <div className="p-4 border-t-2 border-gray-100 bg-white flex gap-2">
          <input 
            className="flex-1 p-3 bg-gray-100 rounded-xl border-2 border-blue-300 text-black placeholder-gray-500 font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Type: 'Add task coding'..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleChat()}
          />
          <button 
            onClick={handleChat} 
            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-black hover:bg-blue-800 transition-all active:scale-95 shadow-md"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}