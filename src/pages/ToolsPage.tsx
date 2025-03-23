import { Moon, Sun, Globe, Check } from "lucide-react"
import { useState } from "react"
import { useTheme } from "../context/ThemeContext"

export function ToolsPage() {
  const { theme, toggleTheme } = useTheme()
  const [domain, setDomain] = useState("")
  const [dnsData, setDnsData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Helper function to convert Unix timestamps to readable dates
  const formatDateIfTimestamp = (value) => {
    if (Array.isArray(value)) {
      return value.map((v) =>
        typeof v === "number" && v > 1000000000
          ? new Date(v * 1000).toUTCString()
          : v
      )
    }
    if (typeof value === "number" && value > 1000000000) {
      return new Date(value * 1000).toUTCString()
    }
    return value
  }

  const fetchDNSRecords = async () => {
    if (!domain || loading) return

    setLoading(true)
    setDnsData(null)
    setError(null)

    try {
      const response = await fetch(
        `https://api.api-ninjas.com/v1/whois?domain=${domain}`,
        {
          method: "GET",
          headers: {
            "X-Api-Key": "+UNuX6USS+afrEhWMI6CNQ==rYylMgi8TsDwq7UO",
            "Content-Type": "application/json",
          },
        }
      )

      if (!response.ok) throw new Error("Failed to fetch DNS records")

      const data = await response.json()
      console.log("Raw API Data:", data)

      // Process data to convert timestamps
      const formattedData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          formatDateIfTimestamp(value),
        ])
      )

      console.log("Formatted Data:", formattedData)
      setDnsData(formattedData)
    } catch (error) {
      setError("Failed to fetch DNS records")
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
            {Object.keys(dnsData).map((key) => (
              <div key={key} className="mb-2">
                <strong className="text-gray-700 capitalize dark:text-gray-200">
                  {key} Records:
                </strong>
                <ul className="text-gray-800 dark:text-gray-300">
                  {Array.isArray(dnsData[key]) ? (
                    dnsData[key].map((record, index) => (
                      <li key={index} className="flex items-center gap-2 ml-4">
                        <Check className="text-green-500" size={14} />
                        {record}
                      </li>
                    ))
                  ) : (
                    <li className="flex items-center gap-2 ml-4">
                      {dnsData[key]}
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
