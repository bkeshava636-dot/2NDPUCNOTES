import { ReactNode } from "react";
import { Link } from "wouter";
import { ChevronRight, type LucideIcon } from "lucide-react";

type LegalPageProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  children: ReactNode;
};

export function LegalPage({ title, description, icon: Icon, children }: LegalPageProps) {
  return (
    <div className="w-full flex-1">
      <section className="bg-slate-50 border-b border-gray-200 px-4 py-10 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs sm:text-sm text-gray-500">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-gray-900 font-medium">{title}</span>
          </nav>
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-blue-50 border border-blue-100 p-2.5 shrink-0 text-primary">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
              <p className="mt-1.5 max-w-2xl text-xs sm:text-sm leading-relaxed text-gray-600">{description}</p>
            </div>
          </div>
        </div>
      </section>
      <article className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">
        <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 leading-relaxed text-gray-700 text-sm sm:text-base">
          {children}
        </div>
      </article>
    </div>
  );
}

export function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-gray-100 py-6 first:pt-0 last:border-0 last:pb-0">
      <h2 className="mb-3 text-lg sm:text-xl font-bold text-gray-900 tracking-tight">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-gray-600 sm:text-base">
        {children}
      </div>
    </section>
  );
}

