import type { Message } from '../lib/schema';

export default function ChatRenderer({
  messages,
  input,
  loading,
  imagePrompt,
  setInput,
  onSend,
  onGenerate
}: {
  messages: Message[];
  input: string;
  loading: boolean;
  imagePrompt: string | null;
  setInput: (val: string) => void;
  onSend: () => void;
  onGenerate: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <div className="text-center text-2xl font-bold mb-4">PaperHugs 🎨</div>
      <div className="border rounded p-4 h-[500px] overflow-y-scroll bg-gray-50 mb-4">
        {messages.map((m, i) => (
          <div key={i} className={`mb-3 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block px-3 py-2 rounded-lg ${m.role === 'user' ? 'bg-blue-200' : 'bg-green-200'}`}>
              {m.content}
            </span>
          </div>
        ))}
        {imagePrompt && (
          <div className="text-center mt-4">
            <button
              onClick={onGenerate}
              className="bg-purple-600 text-white px-6 py-3 rounded shadow"
            >
              🎨 Generate Card
            </button>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
          className="flex-1 border p-2 rounded"
          placeholder="Type your message..."
        />
        <button onClick={onSend} className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
      </div>
    </div>
  );
}
