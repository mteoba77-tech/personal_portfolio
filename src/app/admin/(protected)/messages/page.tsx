import { getFirestore } from "@/lib/firestore";
import type { ContactMessage } from "@/lib/mail";

type StoredMessage = ContactMessage & { id: string; createdAt: Date };

async function getMessages(): Promise<StoredMessage[] | null> {
  const db = getFirestore();
  if (!db) return null;
  const snap = await db.collection("messages").orderBy("createdAt", "desc").limit(100).get();
  return snap.docs.map((doc) => {
    const data = doc.data();
    return { ...(data as ContactMessage), id: doc.id, createdAt: data.createdAt.toDate() };
  });
}

export default async function MessagesPage() {
  const messages = await getMessages();

  if (messages === null) return <p className="text-cat-gray">Messages are stored in Firestore, which is off.</p>;
  if (messages.length === 0) return <p className="text-cat-gray">No messages yet.</p>;

  return (
    <ul className="space-y-4">
      {messages.map((m) => (
        <li key={m.id} className="card p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-sans text-lg font-semibold normal-case tracking-normal">{m.subject}</h2>
            <time className="text-xs text-cat-gray" dateTime={m.createdAt.toISOString()}>
              {m.createdAt.toLocaleString("en-US")}
            </time>
          </div>
          <p className="mt-1 text-sm text-cat-gray">
            {m.name} ·{" "}
            <a href={`mailto:${m.email}`} className="text-cat-yellow hover:underline">
              {m.email}
            </a>
            {m.phone && ` · ${m.phone}`}
          </p>
          <p className="mt-3 whitespace-pre-wrap text-neutral-200">{m.message}</p>
        </li>
      ))}
    </ul>
  );
}
