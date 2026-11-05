"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type ChatListItem = {
  chatId: string;
  chatTitle: string;
};

const API_BASE_URL = "http://localhost:3001";

const FALLBACK_CHATS: ChatListItem[] = [
  { chatId: "chat-101", chatTitle: "Design Review" },
  { chatId: "chat-102", chatTitle: "Product Planning" },
  { chatId: "chat-103", chatTitle: "Sprint Sync" },
];

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [chats, setChats] = useState<ChatListItem[]>(FALLBACK_CHATS);

  useEffect(() => {
    const readChats = async () => {
      try {
        const stored = JSON.parse(localStorage.getItem("chat-list") ?? "null");
        if (Array.isArray(stored) && stored.length > 0) {
          setChats(stored);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/v1/chat-list`);
        const data = (await response.json()) as { chats?: ChatListItem[] };
        setChats(data.chats ?? FALLBACK_CHATS);
      } catch {
        setChats(FALLBACK_CHATS);
      }
    };

    readChats();
    window.addEventListener("chat-list-updated", readChats);

    return () => {
      window.removeEventListener("chat-list-updated", readChats);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <aside className="w-72 border-r border-zinc-200 bg-zinc-900 p-4 text-white">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Chats</h2>
          <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-zinc-200">
            {chats.length}
          </span>
        </div>

        <nav className="space-y-2">
          {chats.map((chat) => {
            const isActive = pathname === `/chat/${chat.chatId}`;

            return (
              <Link
                key={chat.chatId}
                href={`/chat/${chat.chatId}`}
                className={[
                  "block rounded-xl border px-3 py-2 text-left text-sm transition",
                  isActive
                    ? "border-white/20 bg-white/10 text-white"
                    : "border-transparent bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white",
                ].join(" ")}
              >
                <div className="font-medium">{chat.chatTitle}</div>
                <div className="mt-0.5 text-xs text-zinc-400">
                  {chat.chatId}
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1">{children}</div>
    </div>
  );
}
