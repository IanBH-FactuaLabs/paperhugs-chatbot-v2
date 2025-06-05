// app/layout.tsx
export const metadata = {
  title: 'PaperHugs Chatbot',
  description: 'AI-powered greeting card designer for PaperHugs.ai',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
