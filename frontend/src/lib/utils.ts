import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date))
}

export function getStatusColor(status: string) {
  const map: Record<string, string> = {
    ACTIVE: 'bg-emerald-100 text-emerald-700 ring-emerald-600/20',
    INACTIVE: 'bg-slate-100 text-slate-600 ring-slate-500/20',
    LEAD: 'bg-amber-100 text-amber-700 ring-amber-600/20',
  }
  return map[status] ?? 'bg-slate-100 text-slate-600'
}

export function getStatusLabel(status: string) {
  const map: Record<string, string> = {
    ACTIVE: 'Ativo',
    INACTIVE: 'Inativo',
    LEAD: 'Lead',
  }
  return map[status] ?? status
}
