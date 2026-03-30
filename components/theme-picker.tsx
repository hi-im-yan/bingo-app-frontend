"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Palette, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme, THEMES, type Theme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

const THEME_COLORS: Record<Theme, string[]> = {
	default: ["oklch(0.65 0.18 70)", "oklch(0.93 0.015 80)", "oklch(0.55 0.22 27)"],
	neon: ["#8C00FF", "#FF3F7F", "#FFC400"],
	retro: ["#134686", "#ED3F27", "#FEB21A"],
	ember: ["#9B0F06", "#D53E0E", "#EED9B9"],
};

export function ThemePicker() {
	const t = useTranslations("common");
	const { theme, selectTheme } = useTheme();
	const [open, setOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		function handleClick(e: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, [open]);

	return (
		<div className="relative" ref={menuRef}>
			<Button
				variant="ghost"
				size="icon-sm"
				onClick={() => setOpen((prev) => !prev)}
				aria-label={t("themes")}
				aria-expanded={open}
			>
				<Palette className="size-4" />
			</Button>

			{open && (
				<div className="animate-in fade-in-0 zoom-in-95 absolute right-0 top-full z-50 mt-1 min-w-36 rounded-lg border border-border bg-popover p-1 shadow-md">
					{THEMES.map((t) => (
						<button
							key={t}
							onClick={() => {
								selectTheme(t);
								setOpen(false);
							}}
							className={cn(
								"flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted",
								theme === t && "bg-muted font-medium",
							)}
						>
							<div className="flex gap-0.5">
								{THEME_COLORS[t].map((color, i) => (
									<span
										key={i}
										className="size-3 rounded-full border border-border/50"
										style={{ backgroundColor: color }}
									/>
								))}
							</div>
							<span className="capitalize">{t}</span>
							{theme === t && <Check className="ml-auto size-3 text-primary" />}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
