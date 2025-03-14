import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Sidebar } from "./components/Sidebar"
import { LinksPage } from "./pages/LinksPage"
import { EmailsPage } from "./pages/EmailsPage"
import { TagsPage } from "./pages/TagsPage"
import { ToolsPage } from "./pages/ToolsPage"
import { ThemeProvider } from "./context/ThemeContext"

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
          <Sidebar />
          <main className="flex-1 ml-64">
            <Routes>
              <Route path="/" element={<LinksPage />} />
              <Route path="/emails" element={<EmailsPage />} />
              <Route path="/tags" element={<TagsPage />} />
              <Route path="/tools" element={<ToolsPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
