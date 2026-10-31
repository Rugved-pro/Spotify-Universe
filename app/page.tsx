// app/page.tsx
export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-6xl font-serif italic mb-4">
        See where your music takes you
      </h1>
      <a 
        href="/api/auth/login" // Link to your Spotify OAuth flow
        className="px-6 py-3 border border-gray-600 rounded-full hover:border-gold transition-colors"
      >
        Login
      </a>
    </main>
  )
}