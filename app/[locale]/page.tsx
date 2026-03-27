import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PageContainer } from "@/components/page-container";
import { PageHeader, PageTitle, PageDescription } from "@/components/page-header";
import { JoinRoomForm } from "./join-room-form";

export default function Home() {
	const t = useTranslations("home");

	return (
		<PageContainer className="justify-center gap-8">
			<PageHeader>
				<PageTitle className="text-4xl sm:text-5xl">{t("title")}</PageTitle>
				<PageDescription className="text-lg">{t("subtitle")}</PageDescription>
			</PageHeader>

			<div className="flex flex-col gap-4">
				<Link
					href="/create"
					className="inline-flex h-14 items-center justify-center rounded-lg bg-primary px-6 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/80"
				>
					{t("createRoom")}
				</Link>

				<div className="flex items-center gap-3 py-2">
					<div className="h-px flex-1 bg-border" />
					<span className="text-sm text-muted-foreground">{t("joinRoom")}</span>
					<div className="h-px flex-1 bg-border" />
				</div>

				<JoinRoomForm />
			</div>
		</PageContainer>
	);
}
