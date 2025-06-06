'use client';
import React, { useEffect, useRef } from 'react';
import type { Message } from '../lib/schema';

export default function ChatRenderer({
  messages,
  input,
  loading,
  imagePrompt,
  imageUrl,
  status,
  setInput,
  onSend,
  onGenerate
}: {
  messages: Message[];
  input: string;
  loading: boolean;
  imagePrompt: string | null;
  imageUrl: string | null;
  status: 'idle' | 'polling' | 'complete' | 'initializing';
  setInput: (val: string) => void;
  onSend: () => void;
  onGenerate: () => void;
}) {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status, imageUrl]);

  const extractVisibleContent = (content: string) => {
    const jsonMatch = content.match(/\{[^}]*"action":"generate_image"[^}]*\}/);
    if (!jsonMatch) return content.trim();
    return content.replace(jsonMatch[0], '').trim();
  };

  const formatMarkdownBullets = (text: string) => {
    const bulletPattern = /\*\*(.+?)\*\*:\s*(.+?)(?=(\s*-\s*\*\*|$))/g;
    const bullets: JSX.Element[] = [];
    let match;
    while ((match = bulletPattern.exec(text)) !== null) {
      bullets.push(
        <li key={match[1]}>
          <strong>{match[1].trim()}:</strong> {match[2].trim()}
        </li>
      );
    }
    return bullets.length > 0 ? (
      <ul className="list-disc ml-6 mt-1 text-left space-y-1">{bullets}</ul>
    ) : (
      <span>{text}</span>
    );
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 font-sans">
      <h1 className="text-center text-2xl font-bold mb-4">PaperHugs 🎨</h1>

      <div className="border rounded p-4 max-h-[60vh] overflow-y-auto bg-gray-50 mb-4">
        {status === 'initializing' && (
          <div className="text-center text-gray-500">
            <div className="animate-spin inline-block w-6 h-6 border-2 border-t-blue-500 border-gray-300 rounded-full mr-2" />
            Preparing your chat session...
          </div>
        )}

        {messages.map((m, i) => {
          const visibleContent = extractVisibleContent(m.content);

          // Skip rendering hidden action JSON-only replies
          if (m.role === 'assistant' && !visibleContent) return null;

          return (
            <div key={i} className={`mb-3 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div
                className={`inline-block px-4 py-2 rounded-lg max-w-xs break-words whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                {m.role === 'assistant'
                  ? formatMarkdownBullets(visibleContent)
                  : <span>{visibleContent}</span>}
              </div>
            </div>
          );
        })}

        {imagePrompt && status === 'idle' && (
          <div className="text-center mt-6">
            <button
              onClick={onGenerate}
              className="bg-purple-600 text-white px-6 py-3 rounded shadow hover:bg-purple-700 transition"
            >
              🎨 Generate Card
            </button>
          </div>
        )}

        {status === 'polling' && (
          <div className="text-center text-gray-600 mt-4">
            <div className="animate-spin inline-block w-6 h-6 border-2 border-t-purple-600 border-gray-300 rounded-full mr-2" />
            Generating card...
          </div>
        )}

        {status === 'complete' && imageUrl && (
          <div className="text-center mt-6">
            <img
              src={imageUrl}
              alt="Generated card"
              className="max-w-full max-h-[400px] mx-auto rounded shadow"
            />
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
          className="flex-1 border p-3 text-lg rounded shadow-sm"
          placeholder="Type your message..."
          aria-label="Type your message"
        />
        <button
          onClick={onSend}
          disabled={loading}
          className={`px-5 py-3 rounded font-semibold transition ${
            loading
              ? 'bg-blue-300 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
