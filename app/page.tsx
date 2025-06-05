'use client';
import { useEffect, useState } from 'react';
import useChatState from '../hooks/useChatState';
import ChatRenderer from './ChatRenderer';

export default function Page() {
  const [session, setSession] = useState({ userId: '', cardId: '' });

  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.userId && e.detail?.cardId) {
        setSession({ userId: e.detail.userId, cardId: e.detail.cardId });
      }
    };
    window.addEventListener('openChatbot', handler);
    return () => window.removeEventListener('openChatbot', handler);
  }, []);

  const chat = useChatState(session.userId, session.cardId);
  return <ChatRenderer {...chat} />;
}
