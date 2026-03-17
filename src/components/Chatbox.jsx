import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getChatSuggestions, replyToUser } from "../service/chatAgent.js";

export default function Chatbox({ placement = "floating" }) {
  const trip = useSelector((s) => s.trip);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => [
    {
      role: "ai",
      text: "Hi! I’m Nova, your virtual travel agent. Pick a suggestion below or ask your question.",
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollerRef = useRef(null);

  const suggestions = useMemo(() => getChatSuggestions(), []);

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => {
      scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
    }, 40);
    return () => clearTimeout(id);
  }, [open, messages.length, isTyping]);

  const pushUser = (text) => {
    setMessages((m) => [...m, { role: "user", text, ts: Date.now() }]);
  };

  const pushAi = (text, followUps = []) => {
    setMessages((m) => [...m, { role: "ai", text, followUps, ts: Date.now() }]);
  };

  const sendMessage = async (text) => {
    const msg = String(text ?? input).trim();
    if (!msg) return;
    pushUser(msg);
    setInput("");
    setIsTyping(true);

    // Simulated “agent thinking” delay for UX polish
    await new Promise((r) => setTimeout(r, 450));
    const res = replyToUser({ question: msg, trip });
    setIsTyping(false);
    pushAi(res.answer, res.followUps || []);
  };

  const containerStyle =
    placement === "header"
      ? { position: "relative", display: "inline-block", zIndex: 1100 }
      : { position: "fixed", bottom: 20, right: 20, zIndex: 9999 };

  const panelStyle =
    placement === "header"
      ? {
          width: 320,
          height: 380,
          position: "fixed",
          right: 16,
          top: 74, // below the fixed navbar
          overflow: "hidden",
          zIndex: 2000,
        }
      : {
          width: 320,
          height: 380,
          position: "fixed",
          right: 20,
          bottom: 76,
          overflow: "hidden",
          zIndex: 2000,
        };

  return (
    <div style={containerStyle} aria-live="polite">
      {open && (
        <div
          className="card p-2 shadow"
          style={panelStyle}
        >
          <div
            className="d-flex align-items-center justify-content-between px-1"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", paddingBottom: 6 }}
          >
            <div className="fw-semibold" style={{ fontSize: 13 }}>
              AI Agent
            </div>
            <button className="btn btn-sm btn-light" onClick={() => setOpen(false)} aria-label="Close chat">
              ✕
            </button>
          </div>

          <div className="d-flex flex-wrap gap-1 mt-2" style={{ paddingInline: 4 }}>
            {suggestions.slice(0, 6).map((s) => (
              <button
                key={s}
                type="button"
                className="btn btn-sm btn-outline-secondary"
                style={{ fontSize: 12, padding: "3px 8px" }}
                onClick={() => sendMessage(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <div ref={scrollerRef} style={{ flex: 1, overflowY: "auto", padding: 8 }}>
            {messages.map((m) => (
              <div key={m.ts} className="mb-2" style={{ textAlign: m.role === "user" ? "right" : "left" }}>
                <div
                  className={`d-inline-block px-2 py-1 rounded ${m.role === "user" ? "bg-primary text-white" : "bg-light"}`}
                  style={{ maxWidth: "90%", fontSize: 13, whiteSpace: "pre-wrap" }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="mb-2" style={{ textAlign: "left" }}>
                <div className="d-inline-block px-2 py-1 rounded bg-light" style={{ fontSize: 13 }}>
                  Typing...
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
          >
            <input
              className="form-control mt-2"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
            />
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-primary mt-2 flex-grow-1" type="submit" disabled={!input.trim()}>
                Send
              </button>
              <button
                className="btn btn-sm btn-outline-secondary mt-2"
                type="button"
                onClick={() => setInput(suggestions[0])}
              >
                Suggest
              </button>
            </div>
          </form>
        </div>
      )}

      <button className="btn btn-dark" onClick={() => setOpen((v) => !v)} type="button">
        💬 AI
      </button>
    </div>
  );
}

