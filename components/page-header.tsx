import { cn } from "@/lib/utils";

function PageHeader({ className, ...props }: React.ComponentProps<"header">) {
	return (
		<header
			data-slot="page-header"
			className={cn("pb-6 text-center", className)}
			{...props}
		/>
	);
}

function PageTitle({ className, ...props }: React.ComponentProps<"h1">) {
	return (
		<h1
			data-slot="page-title"
			className={cn(
				"text-2xl font-bold tracking-tight sm:text-3xl",
				className,
			)}
			{...props}
		/>
	);
}

function PageDescription({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="page-description"
			className={cn("mt-1.5 text-base text-muted-foreground", className)}
			{...props}
		/>
	);
}

export { PageHeader, PageTitle, PageDescription };
