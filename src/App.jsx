import { Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/AppShell.jsx'
import Pipeline from './pages/Pipeline.jsx'
import Script from './pages/Script.jsx'
import Hooks from './pages/Hooks.jsx'
import Calendar from './pages/Calendar.jsx'

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/pipeline" replace />} />
        <Route path="/pipeline" element={<Pipeline />} />
        <Route path="/script" element={<Script />} />
        <Route path="/hooks" element={<Hooks />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </AppShell>
  )
}
