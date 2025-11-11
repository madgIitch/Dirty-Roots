// src/components/QuestionForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addQuestion } from "@/src/lib/firestore";
import { ensureAnonAuth, auth } from "@/src/lib/firebase";

const schema = z.object({
  text: z.string().min(5, "Escribe una pregunta completa"),
  context: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function QuestionForm({ onCreated }: { onCreated?: (id: string) => void }) {
  const { register, handleSubmit, formState, reset } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    await ensureAnonAuth();
    const uid = auth.currentUser?.uid || "anon";
    const id = await addQuestion({ text: values.text, context: values.context, createdBy: uid });
    reset();
    onCreated?.(id);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="block text-sm mb-1">Pregunta</label>
        <textarea {...register("text")} className="w-full rounded border px-3 py-2 bg-transparent" rows={3} placeholder="¿Conoces sitios tranquilos en Prenzlauer Berg?" />
        {formState.errors.text && <p className="text-red-500 text-sm">{formState.errors.text.message}</p>}
      </div>
      <div>
        <label className="block text-sm mb-1">Contexto (opcional)</label>
        <input {...register("context")} className="w-full rounded border px-3 py-2 bg-transparent" placeholder="Café con terraza, poco ruido" />
      </div>
      <button type="submit" className="px-4 py-2 rounded bg-emerald-500 text-black font-medium">Publicar pregunta</button>
    </form>
  );
}
