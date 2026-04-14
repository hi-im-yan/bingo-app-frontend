"use client";

import { cn } from "@/lib/utils";

interface BingoBallProps extends React.ComponentProps<"div"> {
	number: number;
	drawn?: boolean;
	size?: "sm" | "md" | "lg";
}

function BingoBall({
	number,
	drawn = false,
	size = "md",
	className,
	...props
}: BingoBallProps) {
	return (
		<div
			data-slot="bingo-ball"
			data-drawn={drawn}
			className={cn(
				"inline-flex items-center justify-center rounded-full font-bold tabular-nums transition-colors",
				drawn
					? "bg-ball-drawn text-ball-drawn-foreground shadow-lg ring-2 ring-ball-drawn/30"
					: "bg-muted/40 text-muted-foreground/50",
				size === "sm" && "size-8 text-sm",
				size === "md" && "size-11 text-lg",
				size === "lg" && "size-16 text-3xl",
				className,
			)}
			{...props}
		>
			{number}
		</div>
	);
}

export { BingoBall };
export type { BingoBallProps };
