import { useEffect, useState } from 'react';
import type { Message } from '../lib/schema';

export default function useChatState(userId: string, cardId: string): {
  messages: Message[];
  input: string;
  loading: boolean;
  imagePrompt: string | null;
  imageUrl: string | null;
  status: 'idle' | 'polling' | 'complete' | 'initializing';
  setInput: (val: string) => void;
  onSend: () => void;
  onGenerate: () => void;
} {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePrompt, setImagePrompt] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'polling' | 'complete' | 'initializing'>('initializing');

  useEffect(() => {
    if (userId && cardId) {
      setStatus('idle');
    }
  }, [userId, cardId]);

  const onSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', content: input };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    const response = await fetch('/api/chat-designer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: nextMessages })
    });

    const data = await response.json();
    const reply: Message = { role: 'assistant', content: data.reply };
    setMessages([...nextMessages, reply]);
    setImagePrompt(data.imagePrompt || null);
    setLoading(false);
  };

  const onGenerate = async () => {
    if (!imagePrompt) return;

    setStatus('polling');
    const response = await fetch('/api/trigger-zap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, cardId, imagePrompt })
    });

    const result = await response.json();
    console.log('[TriggerZap] Payload:', { userId, cardId, imagePrompt });
    if (!result.ok) {
      console.warn('⚠️ TriggerZap failed:', result);
    }
  };

  useEffect(() => {
    if (status !== 'polling') return;

    const poll = async () => {
      try {
        const res = await fetch(`/api/receive-image?userId=${userId}&cardId=${cardId}`);
        const json = await res.json();
        if (json.status === 'complete') {
          setImageUrl(json.imageUrl);
          setStatus('complete');
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    };

    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, [status, userId, cardId]);

  return {
    messages,
    input,
    loading,
    imagePrompt,
    imageUrl,
    status,
    setInput,
    onSend,
    onGenerate
  };
}
