import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center px-4">
      <p className="font-mono text-6xl font-bold text-zinc-700">404</p>
      <h1 className="mt-4 text-xl font-semibold text-zinc-100">Page not found</h1>
      <p className="mt-2 text-sm text-zinc-400">This page doesn&apos;t exist in the BKC companion.</p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
      >
        Back to dashboard
      </Link>
    </div>
  )
}
