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

  // Always call the hook
  const {
    messages,
    input,
    loading,
    imagePrompt,
    imageUrl,
    status,
    setInput,
    onSend,
    onGenerate
  } = useChatState(userId, cardId);

  useEffect(() => {
    const valid = userId && cardId && userId !== 'undefined' && cardId !== 'undefined';
    if (valid) {
      setReady(true);
    }
  }, [userId, cardId]);

  if (!ready) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700 text-lg">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-t-blue-500 border-gray-300 rounded-full mb-4" />
          <p>Loading card generator...</p>
        </div>
      </div>
    );
  }

  return (
    <ChatRenderer
      messages={messages}
      input={input}
      loading={loading}
      imagePrompt={imagePrompt}
      imageUrl={imageUrl}
      status={status}
      setInput={setInput}
      onSend={onSend}
      onGenerate={onGenerate}
    />
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen text-gray-700 text-lg">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-t-blue-500 border-gray-300 rounded-full mb-4" />
          <p>Loading card generator...</p>
        </div>
      </div>
    }>
      <ChatPageWithParams />
    </Suspense>
  );
}
