"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages([
          ...newMessages,
          { role: "assistant", content: data.message },
        ]);
      } else {
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: data.error || "حدث خطأ، حاول مرة أخرى.",
          },
        ]);
      }
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "خطأ في الاتصال بالخادم." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "ما هي المنح المتاحة في أوروبا؟",
    "أبحث عن تدريب في البرمجة",
    "فرص تطوع دولية",
    "منح ممولة بالكامل",
  ];

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>فرص خضراء</h1>
          <p>مساعد البحث عن الفرص</p>
        </div>
      </header>

      <main className="chat-area">
        {messages.length === 0 ? (
          <div className="welcome">
            <h2>مرحباً بك</h2>
            <p>اسألني عن الفرص والمنح المتاحة وسأساعدك في إيجاد المناسب لك.</p>
            <div className="suggestions">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  className="suggestion-btn"
                  onClick={() => {
                    setInput(s);
                    inputRef.current?.focus();
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role}`}>
                <div className="message-bubble">
                  <span className="message-label">
                    {msg.role === "user" ? "أنت" : "المساعد"}
                  </span>
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="message assistant">
                <div className="message-bubble">
                  <span className="message-label">المساعد</span>
                  <div className="typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <footer className="input-area">
        <form onSubmit={sendMessage} className="input-form">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب سؤالك هنا..."
            disabled={loading}
            dir="rtl"
          />
          <button type="submit" disabled={loading || !input.trim()}>
            إرسال
          </button>
        </form>
      </footer>
    </div>
  );
}
