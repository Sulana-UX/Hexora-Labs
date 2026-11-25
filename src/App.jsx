import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import { InquiryProvider } from './context/InquiryContext'
import { Layout } from './components/layout/Layout'
import Home from './pages/Home'

const Privacy = lazy(() => import('./pages/Privacy'))
const NotFound = lazy(() => import('./pages/NotFound'))

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      // One route for every clean section URL (/, /services, /work, ...) so the
      // one-page home stays mounted (form + filter state survive navigation).
      { path: '/:section?', element: <Home /> },
      {
        path: '/privacy',
        element: (
          <Suspense fallback={<div className="min-h-screen" />}>
            <Privacy />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<div className="min-h-screen" />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
])

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <InquiryProvider>
        <RouterProvider router={router} />
      </InquiryProvider>
    </MotionConfig>
  )
}
