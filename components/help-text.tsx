"use client";

import { useHelpVisible } from "@/hooks/use-help-visible";
import { cn } from "@/lib/utils";

interface HelpTextProps {
	children: React.ReactNode;
	className?: string;
}

export function HelpText({ children, className }: HelpTextProps) {
	const { helpVisible } = useHelpVisible();

	if (!helpVisible) return null;

	return (
		<div
			data-slot="help-text"
			className={cn(
				"animate-in fade-in-0 duration-300 rounded-lg border-l-2 border-primary/30 bg-primary/5 px-3 py-2 text-sm text-muted-foreground",
				className,
			)}
		>
			{children}
		</div>
	);
}
