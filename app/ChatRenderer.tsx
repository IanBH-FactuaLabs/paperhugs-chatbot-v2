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
  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 font-sans">
      <div className="text-center text-2xl font-bold mb-4">PaperHugs 🎨</div>

      <div className="border rounded p-4 h-[500px] overflow-y-auto bg-gray-50 mb-4">
        {status === 'initializing' && (
          <div className="text-center text-gray-500">
            <div className="animate-spin inline-block w-6 h-6 border-2 border-t-blue-500 border-gray-300 rounded-full mr-2" />
            Preparing your chat session...
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`mb-3 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block px-4 py-2 rounded-lg ${m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`}>
              {m.content}
            </span>
          </div>
        ))}

        {imagePrompt && status !== 'complete' && (
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

        {imageUrl && (
          <div className="text-center mt-6">
            <img
              src={imageUrl}
              alt="Generated card"
              className="max-w-full max-h-[400px] mx-auto rounded shadow"
            />
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
          className="flex-1 border p-3 text-lg rounded shadow-sm"
          placeholder="Type your message..."
        />
        <button
          onClick={onSend}
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-3 rounded font-semibold hover:bg-blue-700 transition"
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
