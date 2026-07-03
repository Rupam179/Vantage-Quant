import { ArrowRight } from 'lucide-react';
import Container from '../common/Container';
import Button from '../common/Button';

export default function CTA() {
  return (
    <section className="bg-bg py-24">
      <Container>
        <div className="grid-paper relative overflow-hidden rounded-md border border-line-dark bg-surface px-8 py-16 text-center md:px-16">
          <h2 className="relative font-display text-3xl font-medium text-cream md:text-4xl">
            Paper trade it this week. Decide with data, not a feeling.
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-cream-dim">
            Free to start, no card required. Connect a broker only when you're ready to size up.
          </p>
          <div className="relative mt-8 flex justify-center">
            <Button as="a" href="/login?mode=signup" variant="primary">
              Create your account <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
