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
      <section className="bg-[#f8fafc] dark:bg-[#111827] border-b border-[#e2e8f0] dark:border-[#293548] px-4 py-10 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs sm:text-sm text-[#64748b] dark:text-[#94A3B8]">
            <Link href="/" className="hover:text-[#1856b8] dark:hover:text-[#818CF8] transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 text-[#94a3b8]" />
            <span className="text-[#112542] dark:text-[#F1F5F9] font-medium">{title}</span>
          </nav>
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-[#ebf3ff] dark:bg-[#1C2638] border border-[#dce8fa] dark:border-[#293548] p-2.5 shrink-0 text-[#1856b8] dark:text-[#818CF8]">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#112542] dark:text-[#F1F5F9]">{title}</h1>
              <p className="mt-1.5 max-w-2xl text-xs sm:text-sm leading-relaxed text-[#5a6b82] dark:text-[#94A3B8]">{description}</p>
            </div>
          </div>
        </div>
      </section>
      <article className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">
        <div className="rounded-xl border border-[#e2e8f0] dark:border-[#293548] bg-white dark:bg-[#151D2E] p-6 sm:p-8 leading-relaxed text-[#334155] dark:text-[#F1F5F9] text-sm sm:text-base">
          {children}
        </div>
      </article>
    </div>
  );
}

export function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-[#eef2f6] dark:border-[#293548] py-6 first:pt-0 last:border-0 last:pb-0">
      <h2 className="mb-3 text-lg sm:text-xl font-bold text-[#112542] dark:text-[#F1F5F9] tracking-tight">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-[#5a6b82] dark:text-[#94A3B8] sm:text-base">
        {children}
      </div>
    </section>
  );
}

