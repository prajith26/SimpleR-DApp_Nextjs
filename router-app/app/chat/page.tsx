"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type ChatSummary = {
  chatId: string;
  chatTitle: string;
};

const API_BASE_URL = "http://localhost:3001";

export default function ChatHomePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = prompt.trim();
    if (!value || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: value }),
      });

      if (!response.ok) throw new Error("Failed to create chat");

      const data = (await response.json()) as {
        chatId: string;
        chatTitle?: string;
      };
      const stored = JSON.parse(
        localStorage.getItem("chat-list") ?? "[]",
      ) as ChatSummary[];
      const nextChats = stored.some((chat) => chat.chatId === data.chatId)
        ? stored
        : [
            { chatId: data.chatId, chatTitle: data.chatTitle ?? data.chatId },
            ...stored,
          ];

      localStorage.setItem("chat-list", JSON.stringify(nextChats));
      window.dispatchEvent(new Event("chat-list-updated"));
      router.push(`/chat/${data.chatId}`);
    } catch (error) {
      console.error(error);
      alert("Unable to create a chat right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full flex-1 items-center justify-center p-8">
      <div className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
          New chat
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-900">
          Start a conversation
        </h1>

        <form onSubmit={handleSubmit} className="mt-8">
          <label
            htmlFor="chat-input"
            className="mb-2 block text-sm font-medium text-zinc-700"
          >
            Message
          </label>
          <input
            id="chat-input"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Type something and press Enter"
            className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-base text-zinc-900 outline-none transition focus:border-zinc-500 focus:bg-white"
          />

          <div className="mt-4 flex items-center justify-between gap-4 text-sm text-zinc-500">
            <span>
              {isSubmitting ? "Creating chat..." : "Press Enter to send"}
            </span>
            <button
              type="submit"
              disabled={isSubmitting || !prompt.trim()}
              className="rounded-full bg-zinc-900 px-4 py-2 text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
            >
              {isSubmitting ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
