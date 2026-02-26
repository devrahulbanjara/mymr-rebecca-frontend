import { useState, useRef, useEffect } from "react";
import { Send, MessageSquare, ArrowRight, Bot, User as UserIcon, Clock, Trash2, Download } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { getChatHistory, saveChatHistory, clearChatHistory as clearStoredHistory, exportChatHistory } from "../utils/chatStorage";

// Component to render answer with inline citations
function AnswerWithCitations({ answer, citations }) {
  const [hoveredCitation, setHoveredCitation] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef(null);

  if (!citations || citations.length === 0) {
    return <div>{answer}</div>;
  }

  const citationGroups = {};
  citations.forEach((citation, index) => {
    const key = `${citation.start_character}-${citation.end_character}`;
    if (!citationGroups[key]) {
      citationGroups[key] = [];
    }
    citationGroups[key].push({ ...citation, citationNumber: index + 1 });
  });

  const positions = Object.entries(citationGroups).map(([key, group]) => {
    const [start, end] = key.split("-").map(Number);
    return { start, end, citations: group };
  });

  positions.sort((a, b) => a.start - b.start);

  const parts = [];
  let lastIndex = 0;

  positions.forEach(({ start, end, citations: citationGroup }) => {
    if (start > lastIndex) {
      parts.push({ type: "text", content: answer.substring(lastIndex, start) });
    }
    parts.push({ type: "cited", content: answer.substring(start, end), citations: citationGroup });
    lastIndex = end;
  });

  if (lastIndex < answer.length) {
    parts.push({ type: "text", content: answer.substring(lastIndex) });
  }

  const handleMouseEnter = (citation, event) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const rect = event.target.getBoundingClientRect();
    setTooltipPosition({ x: rect.left + window.scrollX, y: rect.bottom + window.scrollY + 5 });
    setHoveredCitation(citation);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setHoveredCitation(null), 150);
  };

  return (
    <div className="relative">
      <div>
        {parts.map((part, index) => {
          if (part.type === "text") {
            return <span key={index}>{part.content}</span>;
          } else {
            return (
              <span key={index} className="relative inline">
                {part.content}
                <span className="inline-flex ml-0.5">
                  {part.citations.map((citation, idx) => (
                    <span
                      key={idx}
                      className="text-[#1e4d8c] text-xs font-semibold align-super hover:text-[#2d6ab3] transition-colors cursor-help"
                      onMouseEnter={(e) => handleMouseEnter(citation, e)}
                      onMouseLeave={handleMouseLeave}
                    >
                      [{citation.citationNumber}]
                    </span>
                  ))}
                </span>
              </span>
            );
          }
        })}
      </div>

      {hoveredCitation && (
        <div
          className="fixed z-50 bg-white border border-slate-200 rounded-lg shadow-xl p-4 max-w-md max-h-96 overflow-y-auto"
          style={{ left: `${tooltipPosition.x}px`, top: `${tooltipPosition.y}px` }}
          onMouseEnter={() => timeoutRef.current && clearTimeout(timeoutRef.current)}
          onMouseLeave={() => setHoveredCitation(null)}
        >
          <div className="text-xs font-bold text-[#1e4d8c] mb-2">
            Source [{hoveredCitation.citationNumber}]
          </div>
          <div className="text-xs text-slate-500 mb-2 space-y-0.5">
            {hoveredCitation.file_uri && <div><span className="font-medium">File:</span> {hoveredCitation.file_uri}</div>}
            {hoveredCitation.page_number !== undefined && hoveredCitation.page_number !== null && (
              <div><span className="font-medium">Page:</span> {hoveredCitation.page_number}</div>
            )}
          </div>
          <div className="text-sm text-slate-700 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
            "{hoveredCitation.source_chunk}"
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChatWindow({ patient }) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Load chat history from localStorage when patient changes
  useEffect(() => {
    const savedMessages = getChatHistory(patient.id);
    setMessages(savedMessages);
  }, [patient.id]);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory(patient.id, messages);
    }
  }, [messages, patient.id]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Clear chat history for current patient
  const clearHistory = () => {
    if (window.confirm(`Clear all chat history for ${patient.name}?`)) {
      clearStoredHistory(patient.id);
      setMessages([]);
    }
  };

  // Export chat history
  const handleExport = () => {
    const success = exportChatHistory(patient.id, patient.name);
    if (success) {
      alert('Chat history exported successfully!');
    } else {
      alert('Failed to export chat history.');
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = { role: "user", content: query };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setQuery("");

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const res = await fetch(`${backendUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, patient_id: patient.id, document_type: "" }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      console.log("Received Response:", data);

      // Extract Rebecca's response from the API
      const rebeccaResponse = data.complete_response?.[0];
      
      const botMessage = {
        role: "bot",
        content: rebeccaResponse?.response || data.answer || "I apologize, but I couldn't generate a response.",
        citations: data.useful_citations || [],
        metadata: rebeccaResponse ? {
          latency: rebeccaResponse.latency,
          input_tokens: rebeccaResponse.input_tokens,
          output_tokens: rebeccaResponse.output_tokens,
          total_cost: rebeccaResponse.total_cost,
          kb_fetched: rebeccaResponse.kb_fetched,
        } : null,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, {
        role: "bot",
        content: `Error: ${error.message}. Please make sure the backend server is running.`,
        isError: true,
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Header */}
      <header className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#1e4d8c]/10 flex items-center justify-center">
            <UserIcon size={22} className="text-[#1e4d8c]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#1e4d8c] tracking-tight">{patient.name}</h2>
            <p className="text-xs text-slate-400 font-medium">Patient ID: {patient.id.slice(0, 20)}...</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {messages.length > 0 && (
            <>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-[#1e4d8c] hover:bg-[#1e4d8c]/5 transition-all duration-200"
                title="Export chat history"
              >
                <Download size={14} />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button
                onClick={clearHistory}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                title="Clear chat history"
              >
                <Trash2 size={14} />
                <span className="hidden sm:inline">Clear</span>
              </button>
            </>
          )}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-100">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-green-700">Connected</span>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-8">
            <div className="w-16 h-16 rounded-xl bg-[#1e4d8c]/10 flex items-center justify-center mb-6">
              <MessageSquare size={28} className="text-[#1e4d8c]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1e4d8c] mb-2">Start a Conversation with Rebecca</h3>
            <p className="text-slate-500 mb-8 max-w-md leading-relaxed">
              Ask Rebecca questions about <span className="font-medium text-slate-700">{patient.name}</span>'s medical history.
              She'll analyze the records and provide intelligent insights.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
              {[
                "What were the recent visit dates?",
                "What medications are prescribed?",
                "Show diagnosis history",
                "Summarize patient information"
              ].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(suggestion)}
                  className="group text-left px-4 py-3 rounded-lg bg-white border border-slate-200 hover:border-[#1e4d8c]/30 hover:bg-[#1e4d8c]/5 transition-all duration-200 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 group-hover:text-[#1e4d8c]">{suggestion}</span>
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-[#1e4d8c] transition-all" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i}>
            {msg.role === "user" ? (
              <div className="flex justify-end">
                <div className="max-w-[75%] px-5 py-3 rounded-lg rounded-br-sm bg-[#1e4d8c] text-white shadow-sm">
                  <p className="text-[15px] leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ) : msg.isError ? (
              <div className="flex justify-start">
                <div className="max-w-[80%] px-5 py-3 rounded-lg rounded-bl-sm bg-red-50 border border-red-100 text-red-700">
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <Bot size={16} />
                  <span className="text-xs font-medium">Rebecca</span>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[85%] px-5 py-4 rounded-lg rounded-bl-sm bg-white border border-slate-200 shadow-sm">
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-3 text-slate-700 leading-relaxed text-[14px]">{children}</p>,
                          strong: ({ children }) => <strong className="text-slate-900 font-semibold">{children}</strong>,
                          li: ({ children }) => <li className="text-slate-700 mb-1.5 text-[14px]">{children}</li>,
                          ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-3 ml-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-3 ml-1">{children}</ol>,
                          h1: ({ children }) => <h1 className="text-lg font-bold text-slate-900 mb-2">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-base font-bold text-slate-800 mb-2">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-sm font-semibold text-slate-800 mb-1">{children}</h3>,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <AnswerWithCitations answer="" citations={msg.citations} />
                        </div>
                      )}
                    </div>
                    {msg.metadata && (
                      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} />
                          <span>{msg.metadata.latency?.toFixed(2)}s</span>
                        </div>
                        {msg.metadata.input_tokens && msg.metadata.output_tokens && (
                          <div className="flex items-center gap-1.5">
                            <span>Tokens: {msg.metadata.input_tokens} → {msg.metadata.output_tokens}</span>
                          </div>
                        )}
                        {msg.metadata.kb_fetched !== undefined && (
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              msg.metadata.kb_fetched 
                                ? 'bg-green-50 text-green-700 border border-green-200' 
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}>
                              {msg.metadata.kb_fetched ? '📚 KB Used' : '💭 Memory Only'}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-400">
              <Bot size={16} className="animate-pulse" />
              <span className="text-xs font-medium">Rebecca is thinking...</span>
            </div>
          </div>
        )}
        
        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-2 border border-slate-200 focus-within:border-[#1e4d8c] focus-within:ring-2 focus-within:ring-[#1e4d8c]/10 transition-all duration-200">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Ask about ${patient.name}'s records...`}
              className="flex-1 bg-transparent px-4 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none text-[15px]"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="flex items-center gap-2 bg-[#1e4d8c] text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-[#2d6ab3] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Send size={16} />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </form>
      </footer>
    </div>
  );
}
