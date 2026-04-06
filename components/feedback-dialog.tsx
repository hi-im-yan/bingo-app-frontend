"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

const feedbackSchema = z.object({
	name: z.string().min(1).max(100),
	content: z.string().min(1).max(2000),
	email: z.string().email().max(254).optional().or(z.literal("")),
	phone: z.string().max(20).optional().or(z.literal("")),
});

type FeedbackValues = z.infer<typeof feedbackSchema>;

export interface FeedbackDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
	const t = useTranslations("feedback");
	const tCommon = useTranslations("common");

	const form = useForm<FeedbackValues>({
		resolver: zodResolver(feedbackSchema),
		defaultValues: {
			name: "",
			content: "",
			email: "",
			phone: "",
		},
	});

	async function onSubmit(values: FeedbackValues) {
		try {
			await api.submitFeedback({
				name: values.name,
				content: values.content,
				email: values.email || undefined,
				phone: values.phone || undefined,
			});
			toast.success(t("success"));
			form.reset();
			onOpenChange(false);
		} catch {
			toast.error(t("error"));
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("title")}</DialogTitle>
					<DialogDescription>{t("description")}</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("nameLabel")}</FormLabel>
									<FormControl>
										<Input
											placeholder={t("namePlaceholder")}
											autoComplete="name"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="content"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("contentLabel")}</FormLabel>
									<FormControl>
										<textarea
											placeholder={t("contentPlaceholder")}
											rows={4}
											className="w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 resize-none md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("emailLabel")}</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder={t("emailPlaceholder")}
											autoComplete="email"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("phoneLabel")}</FormLabel>
									<FormControl>
										<Input
											type="tel"
											placeholder={t("phonePlaceholder")}
											autoComplete="tel"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
								disabled={form.formState.isSubmitting}
							>
								{tCommon("cancel")}
							</Button>
							<Button
								type="submit"
								disabled={form.formState.isSubmitting}
							>
								{form.formState.isSubmitting ? t("submitting") : t("submit")}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
