import { NextResponse } from 'next/server';

export async function GET() {
  // 1. Define permissions your app needs from the Spotify user
  const scope = 'user-read-private user-read-email';

  // 2. Build query parameters for Spotify's authorize endpoint
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    scope: scope,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
  });

  // 3. Construct the full Spotify login URL
  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;

  // 4. Instantly redirect the user's browser to Spotify
  return NextResponse.redirect(spotifyAuthUrl);
}