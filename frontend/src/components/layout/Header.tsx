import { Menu, Bell, Search } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useLocation } from 'react-router-dom'

const pageTitles: Record<string, string> = {
  '/app/dashboard': 'Dashboard',
  '/app/customers': 'Clientes',
  '/app/products': 'Produtos',
}

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuthStore()
  const location = useLocation()
  const title = pageTitles[location.pathname] ?? 'Nexus'

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center gap-4 px-4 md:px-6 shrink-0">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1">
        <h1 className="font-display font-semibold text-slate-900">{title}</h1>
      </div>

      <div className="hidden md:flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-64">
        <Search size={15} className="text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Buscar..."
          className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
        />
        <kbd className="hidden lg:inline-flex items-center gap-1 rounded border border-slate-200 px-1.5 py-0.5 text-xs text-slate-400">
          ⌘K
        </kbd>
      </div>

      <button className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
        <Bell size={18} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-600 rounded-full ring-2 ring-white" />
      </button>

      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-bold">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-bold">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
      </div>
    </header>
  )
}
