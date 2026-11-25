import { Cafe, Campus, Clinic, Finance, Forecast, Inventory } from './ProjectPreviews'

/** Maps a portfolio entry's `preview` key to its mockup and stage colour. */
export const previewStages = {
  campus: { Component: Campus, stage: 'bg-[#e6f0fb]' },
  cafe: { Component: Cafe, stage: 'bg-[#f4ece6]' },
  finance: { Component: Finance, stage: 'bg-[#e4f6fc]' },
  inventory: { Component: Inventory, stage: 'bg-[#eaeff6]' },
  forecast: { Component: Forecast, stage: 'bg-[#dde8f6]' },
  clinic: { Component: Clinic, stage: 'bg-[#e8f3fb]' },
}
