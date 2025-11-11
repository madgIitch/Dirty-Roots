// src/components/AnswerCard.tsx
"use client";

import { Answer } from "@/src/lib/firestore";

export default function AnswerCard({ answer }: { answer: Answer }) {
  return (
    <div className="rounded border p-3">
      <p className="whitespace-pre-wrap">{answer.text}</p>
      {answer.references?.length ? (
        <div className="mt-2 text-sm opacity-80">
          Referencias: {answer.references.map((r, i) => (
            <span key={i} className="mr-2 underline break-all">{r}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
