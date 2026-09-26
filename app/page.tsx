import Link from 'next/link';

// Static-hosting friendly entry point: Turkish is the master locale.
export default function RootPage() {
  return (
    <main>
      <meta httpEquiv="refresh" content="0; url=/tr/" />
      <p>
        <Link href="/tr/">AMIR 77 İnşaat</Link>
      </p>
    </main>
  );
}
