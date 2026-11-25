import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { FeaturedProjects } from './FeaturedProjects'

export function Portfolio() {
  return (
    <section id="work" aria-labelledby="work-title" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          id="work-title"
          eyebrow="Our Work"
          title="Ideas Turned into Experiences"
          intro="Full-stack products we have designed and built end to end — from the first sketch to booking flows, payments and staff dashboards."
        />
        <FeaturedProjects />
      </Container>
    </section>
  )
}
