import { Moon, Sun, Globe } from "lucide-react"
import { useState } from "react"
import { useTheme } from "../context/ThemeContext"

export function ToolsPage() {
  const { theme, toggleTheme } = useTheme()
  const [domain, setDomain] = useState("")
  const [dnsData, setDnsData] = useState<{ [key: string]: string[] } | null>(
    null
  )
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchDNSRecords = async () => {
    if (!domain || loading) return

    setLoading(true)
    setDnsData(null)
    setError(null)

    try {
      const response = await fetch(
        `https://host.io/api/dns/${domain}?token=${
          import.meta.env.VITE_API_KEY
        }`
      )
      if (!response.ok) throw new Error("Failed to fetch DNS records")

      const data = await response.json()
      console.log("API Response:", data)

      setDnsData(data)
      setError(data.error || null)
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-bold dark:text-white">Tools</h2>

      {/* Dark Mode Toggle */}
      <div className="p-6 mb-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === "dark" ? (
              <Moon className="text-gray-600 dark:text-gray-300" size={24} />
            ) : (
              <Sun className="text-gray-600 dark:text-gray-300" size={24} />
            )}
            <span className="font-medium text-gray-700 dark:text-gray-200">
              {theme === "dark" ? "Dark Mode" : "Light Mode"}
            </span>
          </div>
          <button
            onClick={toggleTheme}
            className="relative inline-flex items-center h-6 bg-gray-200 rounded-full w-11 dark:bg-gray-700"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                theme === "dark" ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* DNS Lookup Tool */}
      <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="text-gray-600 dark:text-gray-300" size={24} />
          <span className="font-medium text-gray-700 dark:text-gray-200">
            DNS Lookup
          </span>
        </div>

        <input
          type="text"
          placeholder="Enter domain (example.com)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-900 dark:text-white"
        />

        <button
          onClick={fetchDNSRecords}
          disabled={loading}
          className={`w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Loading..." : "Get DNS Records"}
        </button>

        {/* Error Message */}
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}

        {/* DNS Results */}
        {dnsData && (
          <div className="p-4 mt-4 bg-gray-100 rounded dark:bg-gray-700">
            {["a", "aaaa", "mx", "ns"].map((key) =>
              dnsData[key] ? (
                <div key={key} className="mb-2">
                  <strong className="text-gray-700 capitalize dark:text-gray-200">
                    {key} Records:
                  </strong>
                  <ul className="text-gray-800 dark:text-gray-300">
                    {dnsData[key].map((record, index) => (
                      <li key={index} className="ml-4">
                        • {record}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  )
}
