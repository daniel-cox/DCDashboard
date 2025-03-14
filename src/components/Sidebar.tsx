import { Link, useLocation } from "react-router-dom"
import { LinkIcon, Mail, Tag, Settings } from "lucide-react"

export function Sidebar() {
  const location = useLocation()

  const menuItems = [
    { path: "/", icon: LinkIcon, label: "Links" },
    { path: "/emails", icon: Mail, label: "Emails" },
    { path: "/tags", icon: Tag, label: "Tags" },
    { path: "/tools", icon: Settings, label: "Tools" },
  ]

  return (
    <nav className="fixed top-0 left-0 w-64 h-screen text-white bg-gray-800 dark:bg-gray-800">
      <div className="p-4">
        <h1 className="mb-8 text-xl font-bold">DC's Dashboard</h1>
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-gray-700 dark:bg-gray-800"
                      : "hover:bg-gray-700 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
