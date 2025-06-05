export type Message = {
  role: 'user' | 'assistant';
  content: string;
  action?: string | null;
  imagePrompt?: string;
};
