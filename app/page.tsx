'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import useChatState from '../hooks/useChatState';
import ChatRenderer from './ChatRenderer';

function ChatWithParams() {
  const params = useSearchParams();
  const userId = params.get('userId') || '';
  const cardId = params.get('cardId') || '';

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (userId && cardId) {
      setReady(true);
    }
  }, [userId, cardId]);

  if (!ready) {
    return <div>🔄 Preparing your chat session...</div>;
  }

  const chat = useChatState(userId, cardId);
  return <ChatRenderer {...chat} />;
}


export default function Page() {
  return (
    <Suspense fallback={<div>🔄 Preparing your chat session...</div>}>
      <ChatWithParams />
    </Suspense>
  );
}
