'use client';
import { useEffect, useState } from 'react';
import useChatState from '../hooks/useChatState';
import ChatRenderer from './ChatRenderer';

export default function Page() {
  const [session, setSession] = useState({ userId: '', cardId: '' });

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const { userId, cardId } = e.detail || {};
      console.log("✅ Received session data:", { userId, cardId });
      if (userId && cardId) {
        setSession({ userId, cardId });
      }
    };

    window.addEventListener('openChatbot', handler as EventListener);
    return () => window.removeEventListener('openChatbot', handler as EventListener);
  }, []);

  // ⛔️ Prevent premature chat load
  if (!session.userId || !session.cardId) {
    return (
      <div className="text-center p-4 text-gray-600">
        🔄 Preparing your chat session...
      </div>
    );
  }

  const chat = useChatState(session.userId, session.cardId);
  return <ChatRenderer {...chat} />;
}
