import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string
  subtitle?: string
  trend?: { value: number; label: string }
  icon: React.ReactNode
  color?: 'blue' | 'emerald' | 'amber' | 'violet'
}

const colorMap = {
  blue: { bg: 'bg-primary-50', icon: 'bg-primary-100 text-primary-600', text: 'text-primary-600' },
  emerald: { bg: 'bg-emerald-50', icon: 'bg-emerald-100 text-emerald-600', text: 'text-emerald-600' },
  amber: { bg: 'bg-amber-50', icon: 'bg-amber-100 text-amber-600', text: 'text-amber-600' },
  violet: { bg: 'bg-violet-50', icon: 'bg-violet-100 text-violet-600', text: 'text-violet-600' },
}

export default function MetricCard({ title, value, subtitle, trend, icon, color = 'blue' }: MetricCardProps) {
  const colors = colorMap[color]
  const isPositive = (trend?.value ?? 0) >= 0

  return (
    <div className="card p-5 flex items-start gap-4 hover:shadow-card-hover transition-all duration-200">
      <div className={cn('w-11 h-11 rounded-2xl flex items-center justify-center shrink-0', colors.icon)}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{title}</p>
        <p className="text-2xl font-display font-bold text-slate-900 leading-none mb-1">{value}</p>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        {trend && (
          <div className={cn('flex items-center gap-1 mt-2 text-xs font-medium', isPositive ? 'text-emerald-600' : 'text-red-500')}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{isPositive ? '+' : ''}{trend.value}%</span>
            <span className="text-slate-400 font-normal">{trend.label}</span>
          </div>
        )}
      </div>
    </div>
  )
}
