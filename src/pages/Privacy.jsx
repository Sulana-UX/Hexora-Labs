import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { site } from '../config/site'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Container, Panel } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/SectionHeading'

const sections = [
  {
    title: 'What this website collects',
    body: 'This website does not use a database, analytics trackers or advertising cookies, and it does not store the details you type into the project inquiry form.',
  },
  {
    title: 'How the inquiry form works',
    body: `When you choose “Open in Email App”, your browser opens your own email application with a message to ${site.email} containing the details you entered. Nothing is sent until you review that email and press Send yourself.`,
  },
  {
    title: 'How we use your information',
    body: 'If you send us an email, we use your name, email address and project details only to understand your request and reply to you. We do not sell or share your information with third parties for marketing.',
  },
  {
    title: 'Retention and your choices',
    body: `Inquiry emails are kept only as long as needed to communicate about your project. You can ask us to delete your correspondence at any time by emailing ${site.email}.`,
  },
  {
    title: 'Hosting',
    body: 'The website is served by a static hosting provider, which may process standard technical information (such as IP address and browser type) to deliver and secure the site.',
  },
]

export default function Privacy() {
  useDocumentTitle('Privacy Notice | Hexora Labs – Software Solutions', 'How Hexora Labs handles information shared through project inquiries.')
  useEffect(() => window.scrollTo(0, 0), [])

  return (
    <Panel aria-labelledby="privacy-title" className="mt-3 bg-ice sm:mt-4">
      <Container className="max-w-3xl pb-20 pt-32 sm:pb-28 sm:pt-40">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-primary">
          <ArrowLeft aria-hidden="true" className="size-4" /> Back to home
        </Link>
        <Eyebrow className="mt-10">Privacy</Eyebrow>
        <h1 id="privacy-title" className="mt-5 text-4xl font-semibold sm:text-5xl">
          Privacy Notice
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          A plain-language summary of how {site.fullName} handles the information you share with us.
        </p>
        <div className="mt-12 space-y-4">
          {sections.map((s) => (
            <section key={s.title} className="rounded-3xl bg-white p-6 sm:p-8">
              <h2 className="text-xl font-semibold">{s.title}</h2>
              <p className="mt-3 leading-relaxed text-muted">{s.body}</p>
            </section>
          ))}
        </div>
        <p className="mt-10 text-sm text-muted">
          Questions? Email{' '}
          <a href={`mailto:${site.email}`} className="font-semibold text-primary underline-offset-4 hover:underline">
            {site.email}
          </a>
          .
        </p>
      </Container>
    </Panel>
  )
}
