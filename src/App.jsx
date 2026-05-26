import { Routes, Route, Navigate } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { PipelineProvider } from './context/PipelineContext.jsx'
import AppShell from './components/AppShell.jsx'
import Pipeline from './pages/Pipeline.jsx'
import Script from './pages/Script.jsx'
import Hooks from './pages/Hooks.jsx'
import Calendar from './pages/Calendar.jsx'

export default function App() {
  return (
    <PipelineProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<Navigate to="/pipeline" replace />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/script" element={<Script />} />
          <Route path="/hooks" element={<Hooks />} />
          <Route path="/calendar" element={<Calendar />} />
        </Routes>
      </AppShell>
      <Analytics />
      <SpeedInsights />
    </PipelineProvider>
  )
}
