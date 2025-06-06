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

  // Always call the hook (valid in client components)
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
    if (userId && cardId) {
      setReady(true);
    }
  }, [userId, cardId]);

  if (!ready) {
    return (
      <div className="text-center mt-10 text-gray-600">
        <div className="animate-spin inline-block w-6 h-6 border-2 border-t-blue-500 border-gray-300 rounded-full mr-2" />
        Preparing your chat session...
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
      <div className="text-center mt-10 text-gray-600">
        <div className="animate-spin inline-block w-6 h-6 border-2 border-t-blue-500 border-gray-300 rounded-full mr-2" />
        Preparing your chat session...
      </div>
    }>
      <ChatPageWithParams />
    </Suspense>
  );
}
