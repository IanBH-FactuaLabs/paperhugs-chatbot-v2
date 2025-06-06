import { useEffect, useState } from 'react';
import type { Message } from '../lib/schema';

export default function useChatState(userId: string, cardId: string) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I’m your AI greeting card designer. What kind of card would you like to create today?",
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePrompt, setImagePrompt] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'polling' | 'complete'>('idle');

  const onSend = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/chat-designer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, cardId, messages: newMessages.map(({ role, content }) => ({ role, content })) })
    });

    const data = await res.json();
    const reply: Message = {
      role: 'assistant',
      content: data.reply,
      action: data.action || null,
      imagePrompt: data.imagePrompt || null
    };

    setMessages([...newMessages, reply]);
    if (reply.imagePrompt) {
      setImagePrompt(reply.imagePrompt);
    }
    setLoading(false);
  };

  const onGenerate = async () => {
    if (!imagePrompt) return;
    console.log('[TriggerZap] Payload:', { userId, cardId, imagePrompt });

    await fetch('/api/trigger-zap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, cardId, imagePrompt })
    });

    setStatus('polling');
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
    setInput,
    onSend,
    onGenerate
  };
}
