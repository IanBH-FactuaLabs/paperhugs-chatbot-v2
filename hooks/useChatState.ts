import { useEffect, useState } from 'react';
import type { Message } from '../lib/schema';

export default function useChatState(
  userId: string,
  cardId: string
): {
  messages: Message[];
  input: string;
  loading: boolean;
  imagePrompt: string | null;
  imageUrl: string | null;
  status: 'idle' | 'polling' | 'complete';
  setInput: (val: string) => void;
  onSend: () => void;
  onGenerate: () => void;
} {
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

  const extractActionJson = (text: string) => {
    const match = text.match(/\{[^}]*"action":"generate_image"[^}]*\}/);
    if (!match) return { cleanedText: text, prompt: null };

    let prompt: string | null = null;

    try {
      const parsed = JSON.parse(match[0]);
      prompt = parsed.imagePrompt || null;
    } catch {
      prompt = null;
    }

    const cleanedText = text.replace(match[0], '').trim();
    return { cleanedText, prompt };
  };

  const onSend = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/chat-designer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        cardId,
        messages: newMessages.map(({ role, content }) => ({ role, content }))
      })
    });

    const data = await res.json();
    let replyText: string = data.reply ?? '';
    const { cleanedText, prompt } = extractActionJson(replyText);

    if (prompt) setImagePrompt(prompt);

    if (cleanedText) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: cleanedText,
          action: data.action || null,
          imagePrompt: prompt
        }
      ]);
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
    status,
    setInput,
    onSend,
    onGenerate
  };
}
