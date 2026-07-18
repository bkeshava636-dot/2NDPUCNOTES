import { ReactNode } from "react";
import { Link } from "wouter";
import { ChevronRight, type LucideIcon } from "lucide-react";

type LegalPageProps = { title: string; description: string; icon: LucideIcon; children: ReactNode };

export function LegalPage({ title, description, icon: Icon, children }: LegalPageProps) {
  return <div className="w-full"><section className="bg-primary px-4 py-10 text-primary-foreground sm:py-14"><div className="mx-auto max-w-3xl"><div className="mb-5 flex items-center gap-2 text-sm text-primary-foreground/75"><Link href="/" className="hover:text-white">Home</Link><ChevronRight className="h-3.5 w-3.5" /><span>{title}</span></div><div className="flex items-start gap-4"><div className="rounded-xl bg-white/15 p-3"><Icon className="h-7 w-7" /></div><div><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-primary-foreground/80 sm:text-base">{description}</p></div></div></div></section><article className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12"><div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">{children}</div></article></div>;
}

export function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return <section className="border-b border-gray-100 py-6 first:pt-0 last:border-0 last:pb-0"><h2 className="mb-3 text-xl font-bold text-gray-900">{title}</h2><div className="space-y-3 text-sm leading-6 text-gray-600 sm:text-base">{children}</div></section>;
}
