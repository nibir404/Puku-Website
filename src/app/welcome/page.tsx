import type { Metadata } from "next";
import { Welcome } from "@/components/page/welcome";

export const metadata: Metadata = { title: "Welcome", robots: { index: false, follow: false } };

const PLANS: Record<string, string> = { pro: "Pro", team: "Team", enterprise: "Enterprise" };

/** Post-payment landing. Point the payment provider's success URL at /welcome?plan=pro (or team). */
export default async function WelcomePage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const { plan } = await searchParams;
  return <Welcome plan={PLANS[plan?.toLowerCase() ?? ""] ?? "Your plan"} />;
}
