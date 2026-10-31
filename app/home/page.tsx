export default function HomePage() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
			<section className="max-w-2xl text-center">
				<p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
					Spotify Universe
				</p>
				<h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
					Your music, explored.
				</h1>
				<p className="mx-auto mt-6 max-w-xl text-lg text-zinc-400">
					Discover artists, albums, and sounds you love in one place.
				</p>
				<a
					href="/"
					className="mt-9 inline-flex rounded-full bg-emerald-500 px-7 py-3 font-semibold text-zinc-950 transition hover:bg-emerald-400"
				>
					Get started
				</a>
			</section>
		</main>
	);
}
