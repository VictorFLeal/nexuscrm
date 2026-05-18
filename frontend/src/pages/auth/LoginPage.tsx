import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Zap, Mail, Lock } from 'lucide-react'
import { Input, Button } from '@/components/ui'
import { authService } from '@/services'
import { useAuthStore } from '@/store/authStore'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
  try {
    const res = await authService.login(data.email, data.password)

    const { user, accessToken, refreshToken } = res.data.data

    setAuth(user, accessToken, refreshToken)

    toast.success(`Bem-vindo de volta, ${user.name.split(' ')[0]}!`)

    navigate('/app/dashboard')

  } catch (err: any) {
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      'Erro ao fazer login'

    toast.error(message)
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/30 to-white flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-display text-xl font-bold text-white">Nexus</span>
          </div>
          <h2 className="font-display text-4xl font-bold text-white leading-tight mb-4">
            Gerencie seu negócio com inteligência
          </h2>
          <p className="text-primary-200 text-lg leading-relaxed">
            CRM completo, gestão de produtos e dashboard analítico em uma só plataforma.
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[['10K+', 'Clientes'], ['99.9%', 'Uptime'], ['4.9★', 'Avaliação']].map(([v, l]) => (
            <div key={l} className="bg-white/10 rounded-2xl p-4 text-center">
              <p className="font-display text-xl font-bold text-white">{v}</p>
              <p className="text-primary-200 text-xs mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg text-slate-900">Nexus</span>
          </div>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">Entrar</h1>
            <p className="text-slate-500">Acesse sua conta para continuar</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              leftIcon={<Mail size={16} />}
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock size={16} />}
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input type="checkbox" className="rounded" />
                Lembrar de mim
              </label>
              <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                Esqueceu a senha?
              </a>
            </div>

            <Button type="submit" className="w-full" loading={isSubmitting} size="lg">
              Entrar
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
              Não tem conta?{' '}
              <Link to="/register" className="text-primary-600 font-medium hover:text-primary-700">
                Criar conta grátis
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-center text-xs text-slate-400 mb-3">Login de demonstração</p>
            <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 font-mono text-center">
              admin@nexus.com / password
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
