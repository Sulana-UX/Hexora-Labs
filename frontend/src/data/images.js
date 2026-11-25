/**
 * Photography registry. All photos are from Unsplash (free to use under the
 * Unsplash License — https://unsplash.com/license). Originals were cropped and
 * converted to responsive WebP; see README → "Asset management".
 */
import students1200 from '../assets/images/students-collaborating-1200.webp'
import students720 from '../assets/images/students-collaborating-720.webp'
import workspace1200 from '../assets/images/workspace-desk-1200.webp'
import workspace720 from '../assets/images/workspace-desk-720.webp'
import code600 from '../assets/images/code-closeup-600.webp'
import code360 from '../assets/images/code-closeup-360.webp'
import wireframe1200 from '../assets/images/wireframe-sketch-1200.webp'
import wireframe720 from '../assets/images/wireframe-sketch-720.webp'
import analytics640 from '../assets/images/analytics-dashboard-640.webp'
import analytics400 from '../assets/images/analytics-dashboard-400.webp'

export const photos = {
  students: {
    src: students1200,
    srcSet: `${students720} 720w, ${students1200} 1200w`,
    width: 1200,
    height: 900,
    alt: 'University students working together on laptops around a table',
    source: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
  },
  workspace: {
    src: workspace1200,
    srcSet: `${workspace720} 720w, ${workspace1200} 1200w`,
    width: 1200,
    height: 900,
    alt: 'A bright developer workspace with a laptop showing source code',
    source: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
  },
  code: {
    src: code600,
    srcSet: `${code360} 360w, ${code600} 600w`,
    width: 600,
    height: 600,
    alt: 'Close-up of code in a dark editor on a laptop screen',
    source: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
  },
  wireframe: {
    src: wireframe1200,
    srcSet: `${wireframe720} 720w, ${wireframe1200} 1200w`,
    width: 1200,
    height: 800,
    alt: 'A hand sketching app wireframes on paper during the design stage',
    source: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e',
  },
  analytics: {
    src: analytics640,
    srcSet: `${analytics400} 400w, ${analytics640} 640w`,
    width: 640,
    height: 480,
    alt: 'A laptop showing an analytics dashboard with charts',
    source: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
  },
}
