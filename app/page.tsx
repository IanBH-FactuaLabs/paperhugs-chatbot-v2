'use client';
import { useEffect, useState } from 'react';
import useChatState from '../hooks/useChatState';
import ChatRenderer from './ChatRenderer';

export default function Page() {
  const [session, setSession] = useState<{ userId: string; cardId: string } | null>(null);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (typeof e.data === 'object' && e.data.type === 'initialize-session') {
        const { userId, cardId } = e.data;
        console.log("✅ Chatbot received session:", { userId, cardId });
        if (userId && cardId) {
          setSession({ userId, cardId });
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (!session?.userId || !session?.cardId) {
    return (
      <div className="text-center p-4 text-gray-600">
        🔄 Preparing your chat session...
      </div>
    );
  }

  const chat = useChatState(session.userId, session.cardId);
  return <ChatRenderer {...chat} />;
}
