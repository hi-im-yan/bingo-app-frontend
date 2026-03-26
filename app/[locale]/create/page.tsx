"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { api, BingoApiError } from "@/lib/api";
import type { DrawMode } from "@/lib/types";
import { PageContainer } from "@/components/page-container";
import { PageHeader, PageTitle } from "@/components/page-header";
import { GameCard, GameCardContent } from "@/components/ui/game-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

const createRoomSchema = z.object({
	name: z.string().min(1).max(255),
	description: z.string().max(255).optional(),
	drawMode: z.enum(["MANUAL", "AUTOMATIC"]),
});

type CreateRoomValues = z.infer<typeof createRoomSchema>;

export default function CreateRoomPage() {
	const t = useTranslations("createRoom");
	const router = useRouter();
	const [serverError, setServerError] = useState<string | null>(null);

	const form = useForm<CreateRoomValues>({
		resolver: zodResolver(createRoomSchema),
		defaultValues: {
			name: "",
			description: "",
			drawMode: "MANUAL",
		},
	});

	async function onSubmit(values: CreateRoomValues) {
		setServerError(null);
		try {
			const room = await api.createRoom({
				name: values.name,
				description: values.description || undefined,
				drawMode: values.drawMode,
			});
			router.push(`/room/${room.sessionCode}/admin`);
		} catch (error) {
			if (error instanceof BingoApiError) {
				if (error.status === 409) {
					form.setError("name", { message: t("nameConflict") });
				} else {
					setServerError(error.message);
				}
			} else {
				setServerError(t("creating"));
			}
		}
	}

	const drawMode = form.watch("drawMode");

	return (
		<PageContainer>
			<PageHeader>
				<PageTitle>{t("title")}</PageTitle>
			</PageHeader>

			<GameCard>
				<GameCardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-base">{t("nameLabel")}</FormLabel>
										<FormControl>
											<Input
												placeholder={t("namePlaceholder")}
												className="h-12 text-base"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-base">{t("descriptionLabel")}</FormLabel>
										<FormControl>
											<Input
												placeholder={t("descriptionPlaceholder")}
												className="h-12 text-base"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex flex-col gap-2">
								<Label className="text-base">{t("drawModeLabel")}</Label>
								<div className="grid grid-cols-2 gap-3">
									<DrawModeOption
										selected={drawMode === "MANUAL"}
										onClick={() => form.setValue("drawMode", "MANUAL")}
										title={t("manual")}
										description={t("manualDescription")}
									/>
									<DrawModeOption
										selected={drawMode === "AUTOMATIC"}
										onClick={() => form.setValue("drawMode", "AUTOMATIC")}
										title={t("automatic")}
										description={t("automaticDescription")}
									/>
								</div>
							</div>

							{serverError && (
								<p className="text-sm font-medium text-destructive">{serverError}</p>
							)}

							<Button
								type="submit"
								size="lg"
								disabled={form.formState.isSubmitting}
								className="h-14 text-lg font-semibold"
							>
								{form.formState.isSubmitting ? t("creating") : t("createButton")}
							</Button>
						</form>
					</Form>
				</GameCardContent>
			</GameCard>
		</PageContainer>
	);
}

function DrawModeOption({
	selected,
	onClick,
	title,
	description,
}: {
	selected: boolean;
	onClick: () => void;
	title: string;
	description: string;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`flex flex-col items-center gap-1 rounded-xl border-2 p-4 text-center transition-colors ${
				selected
					? "border-primary bg-primary/10 text-foreground"
					: "border-border bg-background text-muted-foreground hover:border-primary/40"
			}`}
		>
			<span className="text-base font-semibold">{title}</span>
			<span className="text-sm">{description}</span>
		</button>
	);
}
