import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Arena Jogos - Memória 32 Pares, Duo Inglês, Tarzan & Super Mario',
  description: 'Portal de jogos com Jogo da Memória 32 Pares com Animais e Objetos de Casa, Duo Inglês para aprender inglês estilo Duolingo com pronúncia em áudio, Tarzan na Floresta e Super Mario Bros 2D.',
  openGraph: {
    title: 'Arena Jogos - Memória 32 Pares, Duo Inglês, Tarzan & Super Mario',
    description: 'Portal de jogos com Jogo da Memória 32 Pares com Animais e Objetos de Casa, Duo Inglês para aprender inglês estilo Duolingo com pronúncia em áudio, Tarzan na Floresta e Super Mario Bros 2D.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arena Jogos - Memória 32 Pares, Duo Inglês, Tarzan & Super Mario',
    description: 'Portal de jogos com Jogo da Memória 32 Pares com Animais e Objetos de Casa, Duo Inglês para aprender inglês estilo Duolingo com pronúncia em áudio, Tarzan na Floresta e Super Mario Bros 2D.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
