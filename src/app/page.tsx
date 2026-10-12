import { Hero } from "@/components/home/hero";
import { ScenesIntro, StatsBand, Stories } from "@/components/home/stories";
import { AgentsAskFirst, CTA, FeatureGrid, Graph, HubIntro, PricingTeaser, Products, Releases } from "@/components/home/sections";

export default function Home() {
  return (
    <>
      <Hero />
      <StatsBand />
      <ScenesIntro />
      <Stories />
      <Products />
      <HubIntro />
      <Graph />
      <AgentsAskFirst />
      <FeatureGrid />
      <Releases />
      <PricingTeaser />
      <CTA />
    </>
  );
}
