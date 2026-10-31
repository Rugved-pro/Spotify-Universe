import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  // 1. If Spotify returns an error or user cancelled authorization
  if (error || !code) {
    return NextResponse.redirect(new URL('/login?error=access_denied', request.url));
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.redirect(new URL('/login?error=missing_env_vars', request.url));
  }

  // 2. Encode Client ID and Client Secret in Base64 for Basic Auth header
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    // 3. Exchange authorization code for access and refresh tokens
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Spotify token exchange failed:', data);
      return NextResponse.redirect(new URL('/login?error=token_failed', request.url));
    }

    // 4. Create redirect response to your protected dashboard page
    const response = NextResponse.redirect(new URL('/home', request.url));

    // 5. Store the Access Token in a secure httpOnly cookie
    response.cookies.set('spotify_access_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: data.expires_in, // Expires in 3600 seconds (1 hour)
      path: '/',
    });

    // 6. Store Refresh Token if returned by Spotify
    if (data.refresh_token) {
      response.cookies.set('spotify_refresh_token', data.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });
    }

    return response;
  } catch (err) {
    console.error('Callback handler error:', err);
    return NextResponse.redirect(new URL('/login?error=server_error', request.url));
  }
}