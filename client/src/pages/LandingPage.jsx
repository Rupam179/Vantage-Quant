import Hero from '../components/marketing/Hero';
import Features from '../components/marketing/Features';
import StrategyExplainer from '../components/marketing/StrategyExplainer';
import PerformancePreview from '../components/marketing/PerformancePreview';
import Pricing from '../components/marketing/Pricing';
import FAQ from '../components/marketing/FAQ';
import CTA from '../components/marketing/CTA';

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <StrategyExplainer />
      <PerformancePreview />
      <Pricing />
      <FAQ />
      <CTA />
    </>
  );
}
