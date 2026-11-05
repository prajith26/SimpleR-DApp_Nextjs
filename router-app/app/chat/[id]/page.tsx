import Link from "next/link";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return ["chat-101", "chat-102", "chat-103", "chat-104"].map((id) => ({
    id,
  }));
}

export default async function ChatDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="flex h-full flex-1 flex-col p-8">
      <div className="mb-6">
        <Link
          href="/chat"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          ← Back to chat list
        </Link>
      </div>

      <div className="max-w-2xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
          Active chat
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-zinc-900">{id}</h1>
        <p className="mt-4 text-lg text-zinc-600">
          This route is rendered at{" "}
          <span className="font-mono text-zinc-900">/chat/{id}</span>.
        </p>

        <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          <p className="font-medium text-zinc-800">Sample conversation</p>
          <p className="mt-2 text-zinc-600">
            User: Hello from the chat demo. This is a sample R&amp;D flow for
            routing.
          </p>
        </div>
      </div>
    </div>
  );
}
