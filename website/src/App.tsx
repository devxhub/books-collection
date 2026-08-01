import { ThemeProvider } from './lib/theme'
import { HomePage } from './pages/HomePage'

export default function App() {
  return (
    <ThemeProvider>
      <HomePage />
    </ThemeProvider>
  )
}
