import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import {
  Plus, Search, Users, Pencil, Trash2, Mail, Phone, Building2,
  Filter, RefreshCw, ChevronRight
} from 'lucide-react'
import {
  Button, Input, Select, Textarea, Badge, Modal,
  Skeleton, EmptyState, Pagination
} from '@/components/ui'
import { customerService } from '@/services'
import { formatDate } from '@/lib/utils'
import type { Customer } from '@/types'

// ── schema ────────────────────────────────────────────────────────────────────
const schema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido').or(z.literal('')).optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  status: z.string(),
  notes: z.string().optional(),
})
type FormData = z.infer<typeof schema>

// ── skeleton rows ─────────────────────────────────────────────────────────────
function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <tr key={i} className="border-b border-slate-50">
          <td className="px-4 py-3.5"><Skeleton className="h-4 w-36" /></td>
          <td className="px-4 py-3.5 hidden sm:table-cell"><Skeleton className="h-4 w-40" /></td>
          <td className="px-4 py-3.5 hidden md:table-cell"><Skeleton className="h-4 w-28" /></td>
          <td className="px-4 py-3.5 hidden lg:table-cell"><Skeleton className="h-4 w-32" /></td>
          <td className="px-4 py-3.5"><Skeleton className="h-6 w-16 rounded-full" /></td>
          <td className="px-4 py-3.5 hidden xl:table-cell"><Skeleton className="h-4 w-20" /></td>
          <td className="px-4 py-3.5"><Skeleton className="h-8 w-20 rounded-xl" /></td>
        </tr>
      ))}
    </>
  )
}

// ── Customer form modal ───────────────────────────────────────────────────────
interface CustomerFormProps {
  open: boolean
  onClose: () => void
  customer?: Customer | null
  onSuccess: () => void
}

function CustomerFormModal({ open, onClose, customer, onSuccess }: CustomerFormProps) {
  const isEdit = !!customer
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'ACTIVE',
      notes: '',
    },
  })

  useEffect(() => {
    if (open) {
      reset(
        customer
          ? { name: customer.name, email: customer.email ?? '', phone: customer.phone ?? '', company: customer.company ?? '', status: customer.status, notes: customer.notes ?? '' }
          : { name: '', email: '', phone: '', company: '', status: 'ACTIVE', notes: '' }
      )
    }
  }, [open, customer, reset])

  const onSubmit = async (data: FormData) => {
    try {
      if (isEdit && customer) {
        await customerService.update(customer.id, data as any)
        toast.success('Cliente atualizado com sucesso!')
      } else {
        await customerService.create(data as any)
        toast.success('Cliente criado com sucesso!')
      }
      onSuccess()
      onClose()
    } catch (err: any) {
      toast.error(err.response?.data?.error ?? 'Erro ao salvar cliente')
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Editar cliente' : 'Novo cliente'} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input label="Nome *" placeholder="Nome completo" error={errors.name?.message} {...register('name')} />
          </div>
          <Input label="Email" type="email" placeholder="email@empresa.com" error={errors.email?.message} {...register('email')} />
          <Input label="Telefone" placeholder="(11) 9 0000-0000" {...register('phone')} />
          <Input label="Empresa" placeholder="Nome da empresa" leftIcon={<Building2 size={14} />} {...register('company')} />
          <Select label="Status" {...register('status')}>
            <option value="ACTIVE">Ativo</option>
            <option value="LEAD">Lead</option>
            <option value="INACTIVE">Inativo</option>
          </Select>
          <div className="sm:col-span-2">
            <Textarea label="Observações" placeholder="Notas sobre este cliente..." {...register('notes')} />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" loading={isSubmitting} className="flex-1">
            {isEdit ? 'Salvar alterações' : 'Criar cliente'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

// ── Delete confirm modal ──────────────────────────────────────────────────────
interface DeleteModalProps {
  open: boolean
  customer: Customer | null
  onClose: () => void
  onConfirm: () => void
  loading: boolean
}

function DeleteModal({ open, customer, onClose, onConfirm, loading }: DeleteModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Excluir cliente" size="sm">
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
            <Trash2 size={18} className="text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">Tem certeza?</p>
            <p className="text-xs text-slate-500 mt-0.5">
              O cliente <strong>{customer?.name}</strong> será removido permanentemente.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button variant="danger" onClick={onConfirm} loading={loading} className="flex-1">
            Sim, excluir
          </Button>
        </div>
      </div>
    </Modal>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selected, setSelected] = useState<Customer | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await customerService.list({ search, status: statusFilter, page, size: 10 })
      const data = res.data.data
      setCustomers(data.content)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
    } catch {
      toast.error('Erro ao carregar clientes')
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter, page])

  useEffect(() => { fetchCustomers() }, [fetchCustomers])

  // reset page on filter change
  useEffect(() => { setPage(0) }, [search, statusFilter])

  const openCreate = () => { setSelected(null); setFormOpen(true) }
  const openEdit = (c: Customer) => { setSelected(c); setFormOpen(true) }
  const openDelete = (c: Customer) => { setSelected(c); setDeleteOpen(true) }

  const handleDelete = async () => {
    if (!selected) return
    setDeleteLoading(true)
    try {
      await customerService.delete(selected.id)
      toast.success('Cliente excluído')
      setDeleteOpen(false)
      fetchCustomers()
    } catch {
      toast.error('Erro ao excluir cliente')
    } finally {
      setDeleteLoading(false)
    }
  }

  const statCounts = {
    all: totalElements,
    active: customers.filter(c => c.status === 'ACTIVE').length,
    lead: customers.filter(c => c.status === 'LEAD').length,
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900">Clientes</h2>
          <p className="text-slate-500 text-sm mt-0.5">Gerencie todos os seus clientes e leads</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={openCreate}>
          Novo cliente
        </Button>
      </motion.div>

      {/* Quick stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-3 gap-4"
      >
        {[
          { label: 'Total', value: totalElements, color: 'text-slate-900' },
          { label: 'Ativos', value: customers.filter(c => c.status === 'ACTIVE').length, color: 'text-emerald-600' },
          { label: 'Leads', value: customers.filter(c => c.status === 'LEAD').length, color: 'text-amber-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-4 text-center">
            <p className={`font-display text-2xl font-bold ${color}`}>{loading ? '—' : value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </motion.div>

      {/* Filters bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-4 flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou empresa..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 shrink-0">
            <Filter size={14} className="text-slate-400" />
            <span className="text-sm text-slate-500 hidden sm:inline">Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow text-slate-700"
          >
            <option value="">Todos</option>
            <option value="ACTIVE">Ativos</option>
            <option value="LEAD">Leads</option>
            <option value="INACTIVE">Inativos</option>
          </select>
          <button
            onClick={fetchCustomers}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors"
            title="Atualizar"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nome</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Telefone</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Empresa</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Cadastro</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton />
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      icon={<Users size={28} />}
                      title="Nenhum cliente encontrado"
                      description={search || statusFilter ? 'Tente ajustar os filtros de busca.' : 'Crie seu primeiro cliente para começar.'}
                      action={
                        !search && !statusFilter ? (
                          <Button icon={<Plus size={16} />} onClick={openCreate}>
                            Criar primeiro cliente
                          </Button>
                        ) : undefined
                      }
                    />
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors group"
                  >
                    {/* Name */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-sm text-slate-900 truncate max-w-[140px]">{customer.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      {customer.email ? (
                        <a href={`mailto:${customer.email}`} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 transition-colors">
                          <Mail size={12} className="shrink-0" />
                          <span className="truncate max-w-[160px]">{customer.email}</span>
                        </a>
                      ) : (
                        <span className="text-slate-300 text-sm">—</span>
                      )}
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      {customer.phone ? (
                        <span className="flex items-center gap-1.5 text-sm text-slate-500">
                          <Phone size={12} className="shrink-0" />
                          {customer.phone}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-sm">—</span>
                      )}
                    </td>

                    {/* Company */}
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      {customer.company ? (
                        <span className="text-sm text-slate-600">{customer.company}</span>
                      ) : (
                        <span className="text-slate-300 text-sm">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <Badge status={customer.status} />
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5 hidden xl:table-cell">
                      <span className="text-sm text-slate-400">{formatDate(customer.createdAt)}</span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(customer)}
                          className="p-2 rounded-lg hover:bg-primary-50 hover:text-primary-600 text-slate-400 transition-colors"
                          title="Editar"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => openDelete(customer)}
                          className="p-2 rounded-lg hover:bg-red-50 hover:text-red-500 text-slate-400 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={14} />
                        </button>
                        <ChevronRight size={14} className="text-slate-300" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && customers.length > 0 && (
          <div className="px-4 border-t border-slate-100">
            <Pagination
              page={page}
              totalPages={totalPages}
              totalElements={totalElements}
              onPageChange={setPage}
            />
          </div>
        )}
      </motion.div>

      {/* Modals */}
      <CustomerFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        customer={selected}
        onSuccess={fetchCustomers}
      />
      <DeleteModal
        open={deleteOpen}
        customer={selected}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  )
}
