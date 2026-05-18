import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts'
import { Users, Package, DollarSign, TrendingUp, UserPlus, Box, Activity } from 'lucide-react'
import MetricCard from '@/components/charts/MetricCard'
import { Skeleton } from '@/components/ui'
import { dashboardService } from '@/services'
import { formatCurrency } from '@/lib/utils'
import type { DashboardSummary, RevenueDataPoint, Activity as ActivityType } from '@/types'
import { useAuthStore } from '@/store/authStore'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
})

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [chart, setChart] = useState<RevenueDataPoint[]>([])
  const [activity, setActivity] = useState<ActivityType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [s, c, a] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getRevenueChart(),
          dashboardService.getRecentActivity(),
        ])
        setSummary(s.data.data)
        setChart(c.data.data)
        setActivity(a.data.data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <motion.div {...fadeUp()}>
        <h2 className="font-display text-2xl font-bold text-slate-900">
          {greeting}, {user?.name?.split(' ')[0]} 👋
        </h2>
        <p className="text-slate-500 mt-0.5">Aqui está o resumo do seu negócio hoje.</p>
      </motion.div>

      {/* Metrics */}
      <motion.div {...fadeUp(0.05)} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)
        ) : (
          <>
            <MetricCard
              title="Receita Mensal"
              value={formatCurrency(summary?.monthlyRevenue ?? 0)}
              trend={{ value: summary?.revenueGrowth ?? 0, label: 'vs mês ant.' }}
              icon={<DollarSign size={20} />}
              color="blue"
            />
            <MetricCard
              title="Total Clientes"
              value={String(summary?.totalCustomers ?? 0)}
              subtitle={`${summary?.activeCustomers ?? 0} ativos`}
              icon={<Users size={20} />}
              color="emerald"
            />
            <MetricCard
              title="Produtos"
              value={String(summary?.totalProducts ?? 0)}
              icon={<Package size={20} />}
              color="amber"
            />
            <MetricCard
              title="Ticket Médio"
              value={formatCurrency(summary?.avgTicket ?? 0)}
              trend={{ value: summary?.conversionRate ?? 0, label: 'conversão' }}
              icon={<TrendingUp size={20} />}
              color="violet"
            />
          </>
        )}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <motion.div {...fadeUp(0.1)} className="card p-5 xl:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-semibold text-slate-900">Receita</h3>
              <p className="text-xs text-slate-400">Últimos 6 meses</p>
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-56" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chart}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1165D0" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#1165D0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(v: number) => [formatCurrency(v), 'Receita']}
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', fontSize: 13 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#1165D0" strokeWidth={2} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div {...fadeUp(0.15)} className="card p-5">
          <div className="mb-5">
            <h3 className="font-display font-semibold text-slate-900">Novos Clientes</h3>
            <p className="text-xs text-slate-400">Por mês</p>
          </div>
          {loading ? (
            <Skeleton className="h-56" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chart} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', fontSize: 13 }}
                />
                <Bar dataKey="customers" fill="#DCEAFE" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div {...fadeUp(0.2)} className="card p-5">
        <div className="flex items-center gap-2 mb-5">
          <Activity size={16} className="text-slate-400" />
          <h3 className="font-display font-semibold text-slate-900">Atividade Recente</h3>
        </div>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
          </div>
        ) : (
          <div className="space-y-1">
            {activity.map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  item.type === 'customer' ? 'bg-primary-100 text-primary-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {item.type === 'customer' ? <UserPlus size={14} /> : <Box size={14} />}
                </div>
                <p className="flex-1 text-sm text-slate-700">{item.message}</p>
                <span className="text-xs text-slate-400 shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
