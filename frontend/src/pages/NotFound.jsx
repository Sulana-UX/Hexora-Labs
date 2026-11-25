import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Container, Panel } from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import markUrl from '../assets/brand/logo-mark.webp'

export default function NotFound() {
  useDocumentTitle('Page not found | Hexora Labs', undefined, { noindex: true })
  return (
    <Panel aria-labelledby="nf-title" className="mt-3 bg-ice sm:mt-4">
      <Container className="flex flex-col items-center pb-24 pt-36 text-center sm:pb-32 sm:pt-44">
        <img src={markUrl} alt="" width="256" height="256" className="size-24 opacity-90" />
        <p className="mt-8 font-display text-sm font-semibold tracking-widest text-primary">ERROR 404</p>
        <h1 id="nf-title" className="mt-3 text-4xl font-semibold sm:text-5xl">
          This page doesn&apos;t exist.
        </h1>
        <p className="mt-4 max-w-md text-muted">The link may be broken or the page may have moved.</p>
        <Button href="/" variant="navy" className="mt-9">
          Back to home
        </Button>
      </Container>
    </Panel>
  )
}
