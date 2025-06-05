'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; // Next.js 13+ hook
import useChatState from '../hooks/useChatState';
import ChatRenderer from './ChatRenderer';

export default function Page() {
  const params = useSearchParams();
  const userId = params.get('userId');
  const cardId = params.get('cardId');

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (userId && cardId) {
      console.log('✅ Chatbot received session from URL:', { userId, cardId });
      setReady(true);
    }
  }, [userId, cardId]);

  if (!ready) {
    return <div>🔄 Preparing your chat session...</div>;
  }

  const chat = useChatState(userId!, cardId!);
  return <ChatRenderer {...chat} />;
}
