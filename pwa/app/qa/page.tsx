// src/app/qa/page.tsx
"use client";

import { useEffect, useState } from "react";
import { listQuestions } from "@/src/lib/firestore";
import QuestionForm from "@/src/components/QuestionForm";
import Link from "next/link";
import { ensureAnonAuth } from "@/src/lib/firebase";

export default function QaPage() {
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    ensureAnonAuth();
    (async () => {
      const q = await listQuestions(100);
      setQuestions(q);
    })();
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
      <div className="space-y-3">
        <h1 className="text-xl font-semibold">Preguntas</h1>
        <div className="space-y-2">
          {questions.map(q => (
            <Link key={q.id} href={`/qa/${q.id}`}>
              <div className="rounded border p-3 hover:bg-white/5 transition">
                <div className="font-medium">{q.text}</div>
                {q.context && <div className="text-sm opacity-80">{q.context}</div>}
                <div className="text-xs opacity-60 mt-1">{q.answersCount} respuestas</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Nueva pregunta</h2>
        <QuestionForm onCreated={(id) => location.assign(`/qa/${id}`)} />
      </div>
    </div>
  );
}
