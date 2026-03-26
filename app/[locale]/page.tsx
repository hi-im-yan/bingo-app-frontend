import { useTranslations } from "next-intl";
import { PageContainer } from "@/components/page-container";
import { PageHeader, PageTitle, PageDescription } from "@/components/page-header";

export default function Home() {
	const t = useTranslations("home");

	return (
		<PageContainer>
			<PageHeader>
				<PageTitle>{t("title")}</PageTitle>
				<PageDescription>{t("subtitle")}</PageDescription>
			</PageHeader>
		</PageContainer>
	);
}
