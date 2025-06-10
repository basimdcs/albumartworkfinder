import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="mb-4 text-6xl font-bold">404</h1>
      <h2 className="mb-6 text-2xl">Page Not Found</h2>
      <p className="mb-8 max-w-md text-gray-600">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-primary px-6 py-2 font-medium text-white transition-colors hover:bg-primary/90"
      >
        Return to Home
      </Link>
    </div>
  )
}
