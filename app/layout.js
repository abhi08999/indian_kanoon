import { DarkModeProvider } from '../hooks/useDarkMode';
import './globals.css';

export const metadata = {
  title: 'Indian Legal Research Assistant',
  description: 'Powered by OOUM AI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <DarkModeProvider>
          {children}
        </DarkModeProvider>
      </body>
    </html>
  );
}