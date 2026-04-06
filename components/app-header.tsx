"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Home, HelpCircle, MessageSquarePlus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useHelpVisible } from "@/hooks/use-help-visible";
import { ThemePicker } from "@/components/theme-picker";
import { FeedbackDialog } from "@/components/feedback-dialog";
import { cn } from "@/lib/utils";

export function AppHeader() {
	const t = useTranslations("common");
	const tFeedback = useTranslations("feedback");
	const { helpVisible, toggleHelp } = useHelpVisible();
	const [feedbackOpen, setFeedbackOpen] = useState(false);

	return (
		<header className="w-full border-b border-border/50" data-slot="app-header">
			<div className="mx-auto flex max-w-lg items-center justify-between px-4 py-2 sm:px-6 lg:max-w-5xl">
				{/* Left: Home link */}
				<Link href="/" aria-label={t("home")} className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}>
					<Home className="size-4" />
				</Link>

				{/* Right: Theme picker + Feedback + Help toggle */}
				<div className="flex items-center gap-1">
				<ThemePicker />
				<Button
					variant="ghost"
					size="icon-sm"
					onClick={() => setFeedbackOpen(true)}
					aria-label={tFeedback("button")}
					className="gap-1.5 sm:w-auto sm:px-2"
				>
					<MessageSquarePlus className="size-4" />
					<span className="hidden text-xs sm:inline">{tFeedback("button")}</span>
				</Button>
				<Button
					variant="ghost"
					size="icon-sm"
					onClick={toggleHelp}
					aria-label={helpVisible ? t("hideHelp") : t("showHelp")}
					aria-pressed={helpVisible}
				>
					<HelpCircle className={cn("size-4", helpVisible && "text-primary")} />
				</Button>
				</div>
				<FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
			</div>
		</header>
	);
}
