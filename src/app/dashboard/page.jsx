export default function Dashboard() {
  return (
    <>
      <div className="flex justify-center items-center mx-auto"></div>
      <main className="flex flex-col gap-8 items-center justify-center min-h-screen p-8 pb-20">
        <h1 className="text-4xl font-bold">Welcome to IT Step Next.js</h1>
        <p className="text-lg text-center sm:text-left">
          Get started by editing <code className="bg-amber-50/10 rounded-2xl p-2">pages/index.js</code>
        </p>
        <nav className="flex gap-4">
          <Link href="/contact" className="btn hover:underline hover:underline-offset-4">Contact</Link>
          <Link href="/dashboard" className="btn hover:underline hover:underline-offset-4">Dashboard</Link>
          <Link href="/setting" className="btn hover:underline hover:underline-offset-4">Setting</Link>
          <Link href="/privacy" className="btn hover:underline hover:underline-offset-4">Privacy</Link>
        </nav>
      </main>
    </>
  )
}