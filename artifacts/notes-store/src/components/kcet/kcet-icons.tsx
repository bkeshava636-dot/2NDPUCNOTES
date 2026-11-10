import {
  Atom,
  FlaskConical,
  Sigma,
  Dna,
  BookOpen,
  History,
  FileCheck2,
  ListChecks,
  Library,
  Zap,
  FileText,
  Cpu,
  Calculator,
  Compass,
  Sparkles,
  Award,
  Layers,
  Target,
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Atom,
  FlaskConical,
  Sigma,
  Dna,
  BookOpen,
  History,
  FileCheck2,
  ListChecks,
  Library,
  Zap,
  FileText,
  Cpu,
  Calculator,
  Compass,
  Sparkles,
  Award,
  Layers,
  Target,
};

export function KcetDynamicIcon({
  name,
  className = "h-5 w-5",
}: {
  name?: string | null;
  className?: string;
}) {
  const Icon = (name && ICON_MAP[name]) || Sparkles;
  return <Icon className={className} />;
}

export const KCET_ICON_OPTIONS = Object.keys(ICON_MAP);

export const KCET_GRADIENT_OPTIONS = [
  { label: "Electric Cyan -> Blue", value: "from-cyan-500 to-blue-600" },
  { label: "Neon Fuchsia -> Purple", value: "from-fuchsia-500 to-purple-600" },
  { label: "Hyper Indigo -> Violet", value: "from-indigo-500 to-violet-600" },
  { label: "Matrix Emerald -> Teal", value: "from-emerald-500 to-teal-600" },
  { label: "Solar Amber -> Orange", value: "from-amber-500 to-orange-600" },
  { label: "Laser Rose -> Pink", value: "from-rose-500 to-pink-600" },
];
