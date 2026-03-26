import { cn } from "@/lib/utils";

function GameCard({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="game-card"
			className={cn(
				"rounded-2xl border bg-card p-5 text-card-foreground shadow-sm",
				className,
			)}
			{...props}
		/>
	);
}

function GameCardHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="game-card-header"
			className={cn("flex items-center gap-3 pb-3", className)}
			{...props}
		/>
	);
}

function GameCardTitle({ className, ...props }: React.ComponentProps<"h3">) {
	return (
		<h3
			data-slot="game-card-title"
			className={cn("text-lg font-semibold leading-tight", className)}
			{...props}
		/>
	);
}

function GameCardContent({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="game-card-content"
			className={cn("", className)}
			{...props}
		/>
	);
}

export { GameCard, GameCardHeader, GameCardTitle, GameCardContent };
