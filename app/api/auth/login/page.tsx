"use client";

import { useState } from "react";

const SPOTIFY_AUTHORIZE_URL = "https://accounts.spotify.com/authorize";
const SCOPES = ["user-read-private", "user-read-email", "user-top-read", "user-read-recently-played"];

function randomString(length: number) {
	const bytes = new Uint8Array(length);
	crypto.getRandomValues(bytes);
	return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function createCodeChallenge(verifier: string) {
	const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
	return btoa(String.fromCharCode(...new Uint8Array(digest)))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}

export default function LoginPage() {
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function signIn() {
		setError("");
		const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
		const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
		if (!clientId || !redirectUri) {
			setError("Spotify login is not configured. Set the client ID and redirect URI.");
			return;
		}

		setLoading(true);
		try {
			const state = randomString(16);
			const verifier = randomString(32);
			const challenge = await createCodeChallenge(verifier);
			sessionStorage.setItem("spotify_oauth_state", state);
			sessionStorage.setItem("spotify_code_verifier", verifier);

			const url = new URL(SPOTIFY_AUTHORIZE_URL);
			url.search = new URLSearchParams({
				client_id: clientId,
				response_type: "code",
				redirect_uri: redirectUri,
				scope: SCOPES.join(" "),
				state,
				code_challenge_method: "S256",
				code_challenge: challenge,
			}).toString();
			window.location.assign(url.toString());
		} catch {
			setLoading(false);
			setError("Unable to start Spotify login. Please try again.");
		}
	}

	return (
		<main style={styles.page}>
			<section style={styles.card} aria-labelledby="login-title">
				<div style={styles.logo} aria-hidden="true">♫</div>
				<p style={styles.eyebrow}>SPOTIFY UNIVERSE</p>
				<h1 id="login-title" style={styles.title}>Your music, your universe.</h1>
				<p style={styles.description}>Connect your Spotify account to explore your listening universe.</p>
				<button type="button" onClick={signIn} disabled={loading} style={styles.button}>
					{loading ? "Connecting…" : "Continue with Spotify"}
				</button>
				{error && <p role="alert" style={styles.error}>{error}</p>}
				<p style={styles.note}>You’ll be securely redirected to Spotify to sign in.</p>
			</section>
		</main>
	);
}

const styles: Record<string, React.CSSProperties> = {
	page: {
		minHeight: "100vh", display: "grid", placeItems: "center", padding: 24,
		background: "radial-gradient(circle at top, #183b32 0, #101713 42%, #080a09 100%)",
		color: "#f5f7f5", fontFamily: "Arial, sans-serif",
	},
	card: {
		width: "100%", maxWidth: 440, boxSizing: "border-box", padding: "48px 40px",
		border: "1px solid rgba(255,255,255,.12)", borderRadius: 24,
		background: "rgba(17, 23, 19, .88)", boxShadow: "0 24px 80px rgba(0,0,0,.35)", textAlign: "center",
	},
	logo: {
		width: 56, height: 56, margin: "0 auto 24px", display: "grid", placeItems: "center",
		borderRadius: "50%", background: "#1ed760", color: "#07110a", fontSize: 34, fontWeight: 700,
	},
	eyebrow: { margin: 0, color: "#1ed760", fontSize: 12, fontWeight: 700, letterSpacing: 2 },
	title: { margin: "12px 0", fontSize: 32, lineHeight: 1.15 },
	description: { margin: "0 0 30px", color: "#b5beb8", lineHeight: 1.6 },
	button: {
		width: "100%", minHeight: 52, border: 0, borderRadius: 999, background: "#1ed760",
		color: "#07110a", fontSize: 15, fontWeight: 700, cursor: "pointer",
	},
	error: { margin: "16px 0 0", color: "#ffaaa6", fontSize: 14 },
	note: { margin: "20px 0 0", color: "#859089", fontSize: 12, lineHeight: 1.5 },
};
