'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import useChatState from '../hooks/useChatState';
import ChatRenderer from './ChatRenderer';

function ChatPageWithParams() {
  const searchParams = useSearchParams();
  const userId = searchParams?.get('userId') ?? '';
  const cardId = searchParams?.get('cardId') ?? '';

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
      <ChatPageWithParams />
    </Suspense>
  );
}
