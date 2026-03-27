import { cn } from "@/lib/utils";

function PageContainer({ className, ...props }: React.ComponentProps<"main">) {
	return (
		<main
			data-slot="page-container"
			className={cn(
				"mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-6 sm:px-6",
				className,
			)}
			{...props}
		/>
	);
}

export { PageContainer };
