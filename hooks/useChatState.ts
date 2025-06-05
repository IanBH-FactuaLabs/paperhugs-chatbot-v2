import { useState } from 'react';
import type { Message } from '../lib/schema';

export default function useChatState(userId: string, cardId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePrompt, setImagePrompt] = useState<string | null>(null);

  return {
    messages,
    input,
    loading,
    imagePrompt,
    setInput,
    onSend: () => {},      // placeholder
    onGenerate: () => {}   // placeholder
  };
}
