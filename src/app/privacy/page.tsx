export const metadata = {
  title: "Privacy",
};

export default function PrivacyPage() {
  return (
    <>
    <div className="flex justify-center mx-auto items-center font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold">Privacy</h1>
        <p className="text-lg text-center sm:text-left">
          We are here to help you with any questions you may have.
        </p>
        <form className="flex flex-col gap-4 w-full max-w-[400px]">
          <input type="text" placeholder="Name" className="input" />
          <input type="email" placeholder="Email" className="input" />
          <textarea placeholder="Message" className="input border-1 rounded-xl p-2 border-amber-50" />
          <button className="btn">Send</button>
        </form>
      </main>
      </div>
      </>
  );
}
