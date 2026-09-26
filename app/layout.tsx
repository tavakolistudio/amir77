import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { metadataBase: new URL('https://amir77insaat.com'), title: 'AMIR 77 İnşaat | Yalova İnşaat Uygulamaları', description: 'AMIR 77 İnşaat — beton, kalıp, demir, duvar ve çatı uygulamaları.', robots: { index: true, follow: true } };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="tr"><body>{children}</body></html>; }
