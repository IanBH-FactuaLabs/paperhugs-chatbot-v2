// app/layout.tsx
import './globals.css'; // ✅ Import Tailwind base styles

export const metadata = {
  title: 'PaperHugs Chatbot',
  description: 'AI-powered greeting card designer for PaperHugs.ai',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}
