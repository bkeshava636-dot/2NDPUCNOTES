import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";
import { useLanguage } from "@/lib/language-context";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, isDark, toggleTheme } = useTheme();
  const { t } = useLanguage();

  const label = isDark
    ? t("Switch to Light Mode", "ಬೆಳಕಿನ ವಿನ್ಯಾಸಕ್ಕೆ ಬದಲಿಸಿ")
    : t("Switch to Dark Mode", "ಡಾರ್ಕ್ ಮೋಡ್‌ಗೆ ಬದಲಿಸಿ");

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className={`h-8.5 w-8.5 px-0 rounded-lg text-[#334155] dark:text-[#F1F5F9] hover:bg-[#f1f5f9] dark:hover:bg-[#1C2638] border border-transparent hover:border-[#cbd5e1] dark:hover:border-[#293548] flex items-center justify-center transition-colors ${className}`}
          aria-label={label}
          title={label}
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
          ) : (
            <Moon className="h-4 w-4 text-[#475569] transition-transform duration-300 hover:-rotate-12" />
          )}
          <span className="sr-only">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs bg-[#0f172a] dark:bg-[#1C2638] text-white py-1 px-2.5 rounded-lg border border-transparent dark:border-[#293548] shadow-md">
        <span>{label}</span>
      </TooltipContent>
    </Tooltip>
  );
}
