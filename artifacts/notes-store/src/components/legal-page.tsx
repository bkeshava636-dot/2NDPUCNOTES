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
      <section className="bg-gradient-to-b from-primary via-primary to-blue-700 px-4 py-12 text-primary-foreground sm:py-16">
        <div className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-blue-100/80">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white font-medium">{title}</span>
          </nav>
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-3.5 shrink-0 text-white shadow-xs">
              <Icon className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">{title}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100/90 sm:text-base">{description}</p>
            </div>
          </div>
        </div>
      </section>
      <article className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs sm:p-10 leading-relaxed text-gray-700">
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

