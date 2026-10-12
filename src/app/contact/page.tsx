import type { Metadata } from "next";
import { Contact } from "@/components/page/misc";

export const metadata: Metadata = { title: "Contact & Support", description: "Talk to a person." };

export default function ContactPage() {
  return <Contact />;
}
