import type { Metadata } from "next";
import { Legal } from "@/components/page/misc";

export const metadata: Metadata = { title: "Legal · Privacy", description: "Puku privacy policy, terms and refunds." };

export default function PrivacyPage() {
  return <Legal />;
}
