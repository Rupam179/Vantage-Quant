import { useAuth } from '../context/useAuth';
import Container from '../components/common/Container';
import BrokerConnect from '../components/dashboard/BrokerConnect';
import PortfolioOverview from '../components/dashboard/PortfolioOverview';
import SignalsPanel from '../components/dashboard/SignalsPanel';
import BacktestPanel from '../components/dashboard/BacktestPanel';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="grid-paper min-h-[calc(100vh-4rem)] bg-bg py-10">
      <Container>
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">Dashboard</p>
          <h1 className="mt-2 font-display text-3xl font-medium text-cream">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}.
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
          <div className="flex flex-col gap-6">
            <BrokerConnect />
            <PortfolioOverview />
            <SignalsPanel />
          </div>
          <BacktestPanel />
        </div>
      </Container>
    </div>
  );
}
