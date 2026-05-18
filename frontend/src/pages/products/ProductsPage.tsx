import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import {
  Plus, Search, Package, Pencil, Trash2, Filter, RefreshCw,
  Upload, Tag, Hash, AlertCircle, ChevronRight, ImageIcon
} from 'lucide-react'
import {
  Button, Input, Select, Textarea, Badge, Modal,
  Skeleton, EmptyState, Pagination
} from '@/components/ui'
import { productService } from '@/services'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Product } from '@/types'

// ── schema ────────────────────────────────────────────────────────────────────
const schema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  sku: z.string().min(1, 'SKU é obrigatório'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Preço inválido'),
  stock: z.coerce.number().int().min(0, 'Estoque inválido'),
  category: z.string().optional(),
  status: z.string(),
  imageUrl: z.string().url('URL inválida').or(z.literal('')).optional(),
})
type FormData = z.infer<typeof schema>

const CATEGORIES = ['Software', 'Serviços', 'Educação', 'Suporte', 'Hardware', 'Consultoria', 'Outro']

// ── Stock indicator ───────────────────────────────────────────────────────────
function StockIndicator({ stock }: { stock: number }) {
  if (stock === 0) return <span className="text-red-500 text-sm font-medium">Esgotado</span>
  function StockIndicator({ stock = 0 }: { stock?: number }) {
  if (stock === 0)
    return <span className="text-red-500 text-sm font-medium">Esgotado</span>

  if (stock < 10)
    return <span className="text-amber-600 text-sm font-medium">{stock} (baixo)</span>

  return <span className="text-slate-700 text-sm">{stock}</span>
}
  return <span className="text-slate-700 text-sm">{stock}</span>
}

// ── Table skeleton ────────────────────────────────────────────────────────────
function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <tr key={i} className="border-b border-slate-50">
          <td className="px-4 py-3.5"><div className="flex items-center gap-3"><Skeleton className="w-10 h-10 rounded-xl" /><Skeleton className="h-4 w-32" /></div></td>
          <td className="px-4 py-3.5 hidden sm:table-cell"><Skeleton className="h-4 w-24" /></td>
          <td className="px-4 py-3.5 hidden md:table-cell"><Skeleton className="h-4 w-20" /></td>
          <td className="px-4 py-3.5 hidden lg:table-cell"><Skeleton className="h-4 w-16" /></td>
          <td className="px-4 py-3.5 hidden xl:table-cell"><Skeleton className="h-4 w-20" /></td>
          <td className="px-4 py-3.5"><Skeleton className="h-6 w-16 rounded-full" /></td>
          <td className="px-4 py-3.5"><Skeleton className="h-8 w-20 rounded-xl" /></td>
        </tr>
      ))}
    </>
  )
}

// ── Product form modal ────────────────────────────────────────────────────────
interface ProductFormProps {
  open: boolean
  onClose: () => void
  product?: Product | null
  onSuccess: () => void
}

function ProductFormModal({ open, onClose, product, onSuccess }: ProductFormProps) {
  const isEdit = !!product
  const [imagePreview, setImagePreview] = useState('')

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '', sku: '', description: '', price: 0, stock: 0,
      category: '', status: 'ACTIVE', imageUrl: '',
    },
  })

  const imageUrlValue = watch('imageUrl')
  useEffect(() => {
    setImagePreview(imageUrlValue ?? '')
  }, [imageUrlValue])

  useEffect(() => {
    if (open) {
      reset(product ? {
        name: product.name, sku: product.sku, description: product.description ?? '',
        price: product.price, stock: product.stock, category: product.category ?? '',
        status: product.status, imageUrl: product.imageUrl ?? '',
      } : {
        name: '', sku: '', description: '', price: 0, stock: 0,
        category: '', status: 'ACTIVE', imageUrl: '',
      })
    }
  }, [open, product, reset])

  const generateSku = () => {
    const prefix = 'NX'
    const random = Math.random().toString(36).substring(2, 7).toUpperCase()
    setValue('sku', `${prefix}-${random}`)
  }

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        ...data,
        price: Number(data.price),
        stock: Number(data.stock),
        imageUrl: data.imageUrl || undefined,
      }
      if (isEdit && product) {
        await productService.update(product.id, payload as any)
        toast.success('Produto atualizado!')
      } else {
        await productService.create(payload as any)
        toast.success('Produto criado!')
      }
      onSuccess()
      onClose()
    } catch (err: any) {
      toast.error(err.response?.data?.error ?? 'Erro ao salvar produto')
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Editar produto' : 'Novo produto'} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Image preview + URL */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Imagem do produto</label>
            <div className="flex gap-3">
              <div className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                {imagePreview ? (
                  <img src={imagePreview} alt="" className="w-full h-full object-cover rounded-xl" onError={() => setImagePreview('')} />
                ) : (
                  <ImageIcon size={24} className="text-slate-300" />
                )}
              </div>
              <div className="flex-1">
                <Input
                  placeholder="https://exemplo.com/imagem.jpg"
                  leftIcon={<Upload size={14} />}
                  {...register('imageUrl')}
                  error={errors.imageUrl?.message}
                />
                <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle size={11} />
                  Cole a URL de uma imagem externa (JPEG, PNG, WebP)
                </p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="sm:col-span-2">
            <Input label="Nome do produto *" placeholder="Nome completo do produto" error={errors.name?.message} {...register('name')} />
          </div>

          {/* SKU */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">SKU *</label>
            <div className="flex gap-2">
              <Input
                placeholder="NX-PROD-001"
                leftIcon={<Hash size={14} />}
                error={errors.sku?.message}
                className="flex-1"
                {...register('sku')}
              />
              <Button type="button" variant="outline" size="sm" onClick={generateSku} className="shrink-0 self-start mt-0">
                Gerar
              </Button>
            </div>
          </div>

          {/* Category */}
          <Select label="Categoria" {...register('category')}>
            <option value="">Selecionar categoria</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Preço *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">R$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                className="w-full pl-9 pr-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                {...register('price')}
              />
            </div>
            {errors.price && <p className="mt-1.5 text-xs text-red-500">{errors.price.message}</p>}
          </div>

          {/* Stock */}
          <Input
            label="Estoque *"
            type="number"
            min="0"
            placeholder="0"
            leftIcon={<Tag size={14} />}
            error={errors.stock?.message}
            {...register('stock')}
          />

          {/* Status */}
          <Select label="Status" {...register('status')}>
            <option value="ACTIVE">Ativo</option>
            <option value="INACTIVE">Inativo</option>
          </Select>

          {/* Description */}
          <div className="sm:col-span-2">
            <Textarea label="Descrição" placeholder="Descrição detalhada do produto..." {...register('description')} />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button type="submit" loading={isSubmitting} className="flex-1">
            {isEdit ? 'Salvar alterações' : 'Criar produto'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

// ── Delete modal ──────────────────────────────────────────────────────────────
function DeleteModal({ open, product, onClose, onConfirm, loading }: {
  open: boolean; product: Product | null; onClose: () => void; onConfirm: () => void; loading: boolean
}) {
  return (
    <Modal open={open} onClose={onClose} title="Excluir produto" size="sm">
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
            <Trash2 size={18} className="text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">Tem certeza?</p>
            <p className="text-xs text-slate-500 mt-0.5">
              O produto <strong>{product?.name}</strong> será removido permanentemente.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button variant="danger" onClick={onConfirm} loading={loading} className="flex-1">Sim, excluir</Button>
        </div>
      </div>
    </Modal>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selected, setSelected] = useState<Product | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await productService.list({ search, status: statusFilter, category: categoryFilter, page, size: 10 })
      const data = res.data.data
      setProducts(data.content)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
    } catch {
      toast.error('Erro ao carregar produtos')
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter, categoryFilter, page])

  useEffect(() => { fetchProducts() }, [fetchProducts])
  useEffect(() => { setPage(0) }, [search, statusFilter, categoryFilter])

  const openCreate = () => { setSelected(null); setFormOpen(true) }
  const openEdit = (p: Product) => { setSelected(p); setFormOpen(true) }
  const openDelete = (p: Product) => { setSelected(p); setDeleteOpen(true) }

  const handleDelete = async () => {
    if (!selected) return
    setDeleteLoading(true)
    try {
      await productService.delete(selected.id)
      toast.success('Produto excluído')
      setDeleteOpen(false)
      fetchProducts()
    } catch {
      toast.error('Erro ao excluir produto')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900">Produtos</h2>
          <p className="text-slate-500 text-sm mt-0.5">Gerencie seu catálogo de produtos e serviços</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={openCreate}>
          Novo produto
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
          { label: 'Ativos', value: products.filter(p => p.status === 'ACTIVE').length, color: 'text-emerald-600' },
          { label: 'Sem estoque', value: products.filter(p => p.stock === 0).length, color: 'text-red-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-4 text-center">
            <p className={`font-display text-2xl font-bold ${color}`}>{loading ? '—' : value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-4 flex flex-col sm:flex-row gap-3 flex-wrap"
      >
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome, SKU ou categoria..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow text-slate-700"
          >
            <option value="">Todos os status</option>
            <option value="ACTIVE">Ativos</option>
            <option value="INACTIVE">Inativos</option>
          </select>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow text-slate-700"
          >
            <option value="">Todas categorias</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <button
            onClick={fetchProducts}
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Produto</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">SKU</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Preço</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Estoque</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Categoria</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton />
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      icon={<Package size={28} />}
                      title="Nenhum produto encontrado"
                      description={search || statusFilter || categoryFilter ? 'Tente ajustar os filtros.' : 'Adicione seu primeiro produto para começar.'}
                      action={
                        !search && !statusFilter && !categoryFilter ? (
                          <Button icon={<Plus size={16} />} onClick={openCreate}>
                            Criar primeiro produto
                          </Button>
                        ) : undefined
                      }
                    />
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors group"
                  >
                    {/* Product */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                          ) : (
                            <Package size={16} className="text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-slate-900 truncate max-w-[160px]">{product.name}</p>
                          {product.description && (
                            <p className="text-xs text-slate-400 truncate max-w-[160px]">{product.description}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
                        {product.sku}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="font-semibold text-sm text-slate-900">{formatCurrency(product.price)}</span>
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <StockIndicator stock={product.stock} />
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3.5 hidden xl:table-cell">
                      {product.category ? (
                        <span className="text-xs bg-primary-50 text-primary-700 border border-primary-100 px-2 py-1 rounded-lg font-medium">
                          {product.category}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-sm">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <Badge status={product.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-2 rounded-lg hover:bg-primary-50 hover:text-primary-600 text-slate-400 transition-colors"
                          title="Editar"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => openDelete(product)}
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
        {!loading && products.length > 0 && (
          <div className="px-4 border-t border-slate-100">
            <Pagination page={page} totalPages={totalPages} totalElements={totalElements} onPageChange={setPage} />
          </div>
        )}
      </motion.div>

      {/* Modals */}
      <ProductFormModal open={formOpen} onClose={() => setFormOpen(false)} product={selected} onSuccess={fetchProducts} />
      <DeleteModal open={deleteOpen} product={selected} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} loading={deleteLoading} />
    </div>
  )
}
