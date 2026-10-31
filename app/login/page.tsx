// app/login/page.tsx
'use client';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Welcome</h1>
      
      {/* Direct link pointing to your API route */}
      <a
        href="/api/auth/login"
        className="bg-green-500 text-black px-6 py-3 rounded-full font-semibold hover:bg-green-400 transition"
      >
        Log in with Spotify
      </a>
    </div>
  );
}