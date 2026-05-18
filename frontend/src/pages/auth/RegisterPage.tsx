import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Zap, Mail, Lock, User, Building2 } from 'lucide-react'
import { Input, Button } from '@/components/ui'
import { authService } from '@/services'
import { useAuthStore } from '@/store/authStore'

const schema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  company: z.string().min(2, 'Informe a empresa'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
})
type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
  try {
    const res = await authService.register({
      name: data.name,
      email: data.email,
      company: data.company,
      password: data.password,
    })

    const { user, accessToken, refreshToken } = res.data.data

    setAuth(user, accessToken, refreshToken)

    toast.success('Conta criada com sucesso!')

    navigate('/app/dashboard')

  } catch (err: any) {
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      'Erro ao criar conta'

    toast.error(message)
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/30 to-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg text-slate-900">Nexus</span>
        </div>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">Criar conta</h1>
          <p className="text-slate-500">14 dias grátis. Sem cartão de crédito.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Nome completo" placeholder="Seu nome" leftIcon={<User size={16} />} error={errors.name?.message} {...register('name')} />
          <Input label="Email" type="email" placeholder="seu@email.com" leftIcon={<Mail size={16} />} error={errors.email?.message} {...register('email')} />
          <Input label="Empresa" placeholder="Nome da empresa" leftIcon={<Building2 size={16} />} error={errors.company?.message} {...register('company')} />
          <Input label="Senha" type="password" placeholder="Mínimo 6 caracteres" leftIcon={<Lock size={16} />} error={errors.password?.message} {...register('password')} />
          <Input label="Confirmar senha" type="password" placeholder="••••••••" leftIcon={<Lock size={16} />} error={errors.confirmPassword?.message} {...register('confirmPassword')} />

          <Button type="submit" className="w-full mt-2" loading={isSubmitting} size="lg">
            Criar conta grátis
          </Button>
        </form>

        <p className="mt-6 text-center text-slate-500 text-sm">
          Já tem conta?{' '}
          <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">Entrar</Link>
        </p>
      </motion.div>
    </div>
  )
}
