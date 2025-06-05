'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import useChatState from '../hooks/useChatState';
import ChatRenderer from './ChatRenderer';

function ChatPageWithParams() {
  const searchParams = useSearchParams();
  const [session, setSession] = useState<{ userId: string; cardId: string } | null>(null);

  useEffect(() => {
    const userId = searchParams.get('userId');
    const cardId = searchParams.get('cardId');

    if (userId && cardId) {
      setSession({ userId, cardId });
    }
  }, [searchParams]);

  if (!session) {
    return <div>🔄 Preparing your chat session...</div>;
  }

  const chat = useChatState(session.userId, session.cardId);
  return <ChatRenderer {...chat} />;
}

export default function Page() {
  return (
    <Suspense fallback={<div>🔄 Preparing your chat session...</div>}>
      <ChatPageWithParams />
    </Suspense>
  );
}
