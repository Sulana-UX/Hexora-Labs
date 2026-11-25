import cineverseHome1200 from '../assets/portfolio/cineverse-home-1200.webp'
import cineverseHome720 from '../assets/portfolio/cineverse-home-720.webp'
import cineverseShowing1200 from '../assets/portfolio/cineverse-showing-1200.webp'
import cineverseShowing720 from '../assets/portfolio/cineverse-showing-720.webp'
import cineverseSeats from '../assets/portfolio/cineverse-seats-640.webp'
import monsoonDay1200 from '../assets/portfolio/monsoon-day-1200.webp'
import monsoonDay720 from '../assets/portfolio/monsoon-day-720.webp'
import monsoonEvening1200 from '../assets/portfolio/monsoon-evening-1200.webp'
import monsoonEvening720 from '../assets/portfolio/monsoon-evening-720.webp'
import monsoonDashboard from '../assets/portfolio/monsoon-dashboard-640.webp'

const shot = (src1200, src720, alt) => ({ src: src1200, srcSet: `${src720} 720w, ${src1200} 1200w`, width: 1200, height: 750, alt })

/**
 * Portfolio — complete, working full-stack projects developed by the Hexora
 * Labs team. Screenshots come from each project's repository and use demo data.
 *
 * To add a project: put optimised .webp screenshots in src/assets/portfolio/,
 * import them above and add an entry below (views = toggleable main
 * screenshots, inset = the small floating screen).
 */
export const featuredProjects = [
  {
    id: 'cineverse',
    title: 'CINEVERSE',
    tagline: 'Beyond the Screen',
    category: 'Web Application',
    description:
      'A luxury cinema website with live seat booking, online payments and an admin dashboard — designed to feel as immersive as the big screen.',
    highlights: [
      'Live seat map with three price tiers and real-time updates',
      'Four-step booking with secure online payment',
      'QR-code e-tickets delivered by email',
      'Admin dashboard: revenue, occupancy, check-in and refunds',
    ],
    tags: ['React 19', 'Express', 'Supabase', 'PayHere'],
    github: 'https://github.com/Sulana-UX/CINEVERSE',
    theme: 'dark',
    views: [
      { label: 'Home', image: shot(cineverseHome1200, cineverseHome720, 'CINEVERSE home page with a cinema auditorium and the CINEVERSE title on screen') },
      { label: 'Now Showing', image: shot(cineverseShowing1200, cineverseShowing720, 'CINEVERSE Now Showing page listing films with showtimes') },
    ],
    inset: { src: cineverseSeats, width: 640, height: 400, alt: 'CINEVERSE seat selection step with a live seat map' },
    insetLabel: 'Seat selection',
  },
  {
    id: 'monsoon-ridge',
    title: 'Monsoon Ridge',
    tagline: 'Jungle Resort & Spa',
    category: 'Web Application',
    description:
      'A complete hotel website and staff dashboard for a jungle resort concept in Sri Lanka — from online booking to front desk, housekeeping, billing and reports.',
    highlights: [
      'Online booking with live pricing, seasons and promo codes',
      'Front desk, housekeeping board and guest billing',
      'Invoices, confirmation emails and verified guest reviews',
      'Revenue reports, staff roles and an activity log',
    ],
    tags: ['React', 'Express', 'Firebase', 'Cloudinary'],
    github: 'https://github.com/Sulana-UX/monsoon-ridge',
    theme: 'light',
    views: [
      { label: 'Day', image: shot(monsoonDay1200, monsoonDay720, 'Monsoon Ridge home page in day view with a pool and mountains') },
      { label: 'Evening', image: shot(monsoonEvening1200, monsoonEvening720, 'Monsoon Ridge home page in evening view with cabana lights on') },
    ],
    inset: { src: monsoonDashboard, width: 640, height: 400, alt: 'Monsoon Ridge staff dashboard overview with revenue and occupancy' },
    insetLabel: 'Staff dashboard',
  },
]
