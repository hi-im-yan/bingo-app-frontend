"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

const playerNameSchema = z.object({
	playerName: z.string().min(1).max(50),
});

type PlayerNameValues = z.infer<typeof playerNameSchema>;

export interface PlayerNameFormProps {
	sessionCode: string;
	onJoin: (playerName: string) => void;
	error?: string | null;
	submitting?: boolean;
}

export function PlayerNameForm({
	sessionCode: _sessionCode,
	onJoin,
	error,
	submitting = false,
}: PlayerNameFormProps) {
	const t = useTranslations("joinRoom");

	const form = useForm<PlayerNameValues>({
		resolver: zodResolver(playerNameSchema),
		defaultValues: {
			playerName: "",
		},
	});

	// Reflect the external error (e.g. 409 name taken) into the form field
	useEffect(() => {
		if (error) {
			form.setError("playerName", { message: error });
		}
	}, [error, form]);

	function onSubmit(values: PlayerNameValues) {
		onJoin(values.playerName);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
				<FormField
					control={form.control}
					name="playerName"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-base">{t("nameLabel")}</FormLabel>
							<FormControl>
								<Input
									placeholder={t("namePlaceholder")}
									className="h-12 text-base"
									autoComplete="off"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type="submit"
					size="lg"
					disabled={submitting || form.formState.isSubmitting}
					className="h-14 text-lg font-semibold"
				>
					{submitting ? t("joining") : t("joinButton")}
				</Button>
			</form>
		</Form>
	);
}
