import React from 'react'
export const metadata = {
  title: "Invoices",
};

export default function Invoices() {
  return (
    <>
      <div className="flex justify-center items-center mx-auto">
        <main className="flex flex-col gap-8 items-center justify-center min-h-screen p-8 pb-20">
          <h1 className="text-4xl font-bold">Welcome to IT Step Next.js</h1>
          <p className="text-lg text-center sm:text-left">
            Get started by editing <code className="bg-amber-50/10 rounded-2xl p-2">Invoices</code>
          </p>
        </main>
      </div>
    </>
  )
}
