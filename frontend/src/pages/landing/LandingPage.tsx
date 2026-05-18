import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Zap, Menu, X, ArrowRight, Check, ChevronDown, ChevronUp,
  BarChart3, Users, Package, Shield, Globe, Headphones,
  Star, TrendingUp, Layers, Bell, Search, LayoutDashboard,
  Sparkles, MoveRight
} from 'lucide-react'

// ── helpers ───────────────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
})

const stagger = (base = 0, step = 0.08) =>
  Array.from({ length: 8 }, (_, i) => fadeUp(base + i * step))

// ── data ──────────────────────────────────────────────────────────────────────
const NAV_LINKS = ['Produto', 'Recursos', 'Preços', 'Empresa']

const FEATURES = [
  {
    icon: <BarChart3 size={22} />,
    title: 'Dashboard inteligente',
    desc: 'Visualize receita, clientes e métricas em tempo real com gráficos interativos e KPIs personalizáveis.',
    color: 'blue',
  },
  {
    icon: <Users size={22} />,
    title: 'CRM completo',
    desc: 'Gerencie todo o ciclo de vida do cliente — leads, negociações ativas e pós-venda — em um único painel.',
    color: 'emerald',
  },
  {
    icon: <Package size={22} />,
    title: 'Gestão de produtos',
    desc: 'Catálogo, estoque, precificação e categorias com controle total e visibilidade de ponta a ponta.',
    color: 'violet',
  },
  {
    icon: <Shield size={22} />,
    title: 'Segurança enterprise',
    desc: 'Autenticação JWT, refresh tokens, criptografia de dados e conformidade com LGPD inclusa.',
    color: 'amber',
  },
  {
    icon: <Globe size={22} />,
    title: 'API REST completa',
    desc: 'Integre com ERP, e-commerce, automações e qualquer ferramenta via API documentada com Swagger.',
    color: 'rose',
  },
  {
    icon: <Headphones size={22} />,
    title: 'Suporte dedicado',
    desc: 'Time especializado, onboarding guiado e SLA garantido para todos os planos pagos.',
    color: 'cyan',
  },
]

const ICON_COLORS: Record<string, string> = {
  blue: 'bg-primary-100 text-primary-600',
  emerald: 'bg-emerald-100 text-emerald-600',
  violet: 'bg-violet-100 text-violet-600',
  amber: 'bg-amber-100 text-amber-600',
  rose: 'bg-rose-100 text-rose-600',
  cyan: 'bg-cyan-100 text-cyan-600',
}

const PLANS = [
  {
    name: 'Starter',
    price: 'R$ 97',
    period: '/mês',
    desc: 'Para freelancers e pequenos negócios.',
    highlight: false,
    cta: 'Começar grátis',
    features: [
      'Até 200 clientes',
      '100 produtos',
      'Dashboard básico',
      'Suporte por email',
      'API REST',
    ],
  },
  {
    name: 'Pro',
    price: 'R$ 297',
    period: '/mês',
    desc: 'Para equipes em crescimento acelerado.',
    highlight: true,
    cta: 'Testar 14 dias grátis',
    features: [
      'Clientes ilimitados',
      'Produtos ilimitados',
      'Dashboard avançado',
      'Relatórios customizados',
      'Suporte prioritário',
      'Integrações ilimitadas',
    ],
  },
  {
    name: 'Business',
    price: 'R$ 697',
    period: '/mês',
    desc: 'Para empresas com volume e complexidade.',
    highlight: false,
    cta: 'Falar com vendas',
    features: [
      'Tudo do Pro',
      'Multi-empresa',
      'SLA garantido',
      'Onboarding dedicado',
      'Customizações sob medida',
      'Gerente de conta',
    ],
  },
]

const TESTIMONIALS = [
  {
    name: 'Fernanda Lima',
    role: 'CEO · Alpha Ventures',
    avatar: 'FL',
    text: 'O Nexus transformou nossa operação comercial. Reduzimos o tempo de fechamento de deals em 40% no primeiro trimestre.',
    rating: 5,
  },
  {
    name: 'Ricardo Moura',
    role: 'Head de Vendas · BetaCorp',
    avatar: 'RM',
    text: 'Interface incrível, muito intuitiva. Nossa equipe adotou sem treinamento. O dashboard de métricas é simplesmente o melhor do mercado.',
    rating: 5,
  },
  {
    name: 'Camila Souza',
    role: 'Fundadora · Zeta Digital',
    avatar: 'CS',
    text: 'Migrei de outro CRM e a diferença é absurda. Nexus é mais rápido, mais bonito e com muito mais funcionalidades pelo mesmo preço.',
    rating: 5,
  },
]

const FAQS = [
  {
    q: 'Preciso de cartão de crédito para o trial?',
    a: 'Não. O período de teste de 14 dias é 100% gratuito e não exige cadastro de cartão. Você só paga se decidir continuar.',
  },
  {
    q: 'Posso migrar dados do meu CRM atual?',
    a: 'Sim! Oferecemos importação via CSV/Excel e integrações nativas com os principais CRMs do mercado. Nossa equipe auxilia na migração.',
  },
  {
    q: 'O sistema funciona no celular?',
    a: 'Totalmente. O Nexus é mobile-first — desenvolvido para funcionar perfeitamente em smartphones, tablets e desktops.',
  },
  {
    q: 'Posso cancelar quando quiser?',
    a: 'Sim, sem multa e sem burocracia. Você pode cancelar a qualquer momento direto pelo painel de configurações.',
  },
  {
    q: 'Vocês estão em conformidade com a LGPD?',
    a: 'Sim. Todos os dados são armazenados em servidores no Brasil, com criptografia AES-256 e processos auditados para compliance com a LGPD.',
  },
]

const INTEGRATIONS = [
  'WhatsApp', 'Slack', 'HubSpot', 'Zapier', 'Mailchimp',
  'Stripe', 'PagSeguro', 'Google Drive', 'Outlook', 'Notion',
]

// ── sub-components ────────────────────────────────────────────────────────────
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center shadow-sm">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg text-slate-900">Nexus</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <a key={l} href="#" className="px-3.5 py-2 text-sm font-medium text-slate-600 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors">
              {l}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2">
            Entrar
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            Testar grátis <ArrowRight size={14} />
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-1"
        >
          {NAV_LINKS.map((l) => (
            <a key={l} href="#" className="block px-3 py-2.5 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-50">
              {l}
            </a>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link to="/login" className="block px-3 py-2.5 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-50 text-center">
              Entrar
            </Link>
            <Link to="/register" className="block bg-primary-600 text-white text-sm font-medium px-4 py-3 rounded-xl text-center">
              Testar grátis →
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  )
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-white">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-primary-50 rounded-full blur-3xl opacity-60" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:48px_48px] opacity-60" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 text-primary-700 rounded-full px-4 py-1.5 text-sm font-medium mb-8">
            <Sparkles size={14} />
            Plataforma SaaS #1 para gestão comercial no Brasil
          </motion.div>

          {/* Headline */}
          <motion.h1 {...fadeUp(0.08)} className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-slate-900 leading-[1.05] tracking-tight mb-6">
            Gerencie clientes e{' '}
            <span className="text-gradient">vendas com clareza</span>
          </motion.h1>

          {/* Sub */}
          <motion.p {...fadeUp(0.16)} className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
            CRM inteligente, dashboard analítico e gestão de produtos — tudo integrado em uma plataforma elegante que sua equipe vai adorar usar.
          </motion.p>

          {/* CTAs */}
          <motion.div {...fadeUp(0.22)} className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-7 py-4 rounded-2xl transition-all shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30 hover:-translate-y-0.5 text-base"
            >
              Começar gratuitamente <MoveRight size={18} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-7 py-4 rounded-2xl border border-slate-200 transition-all text-base"
            >
              Ver demonstração
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div {...fadeUp(0.28)} className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-500">
            {['Sem cartão de crédito', '14 dias grátis', 'Cancele quando quiser'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <Check size={14} className="text-emerald-500" /> {t}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 relative"
        >
          <div className="relative mx-auto max-w-5xl">
            {/* Glow */}
            <div className="absolute -inset-4 bg-gradient-to-b from-primary-600/10 to-transparent rounded-3xl blur-2xl" />
            {/* Mock window */}
            <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-100">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-white border border-slate-200 rounded-md px-4 py-1 text-xs text-slate-400 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    app.nexus.com.br/dashboard
                  </div>
                </div>
              </div>

              {/* App mockup body */}
              <div className="flex h-[420px] sm:h-[520px]">
                {/* Sidebar mockup */}
                <div className="hidden sm:flex flex-col w-52 border-r border-slate-100 bg-white p-3 gap-1">
                  <div className="flex items-center gap-2 px-3 py-2 mb-3">
                    <div className="w-6 h-6 bg-primary-600 rounded-lg flex items-center justify-center">
                      <Zap size={12} className="text-white" />
                    </div>
                    <span className="font-display font-bold text-sm text-slate-900">Nexus</span>
                  </div>
                  {[
                    { icon: <LayoutDashboard size={14} />, label: 'Dashboard', active: true },
                    { icon: <Users size={14} />, label: 'Clientes', active: false },
                    { icon: <Package size={14} />, label: 'Produtos', active: false },
                  ].map((item) => (
                    <div key={item.label} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium ${item.active ? 'bg-primary-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
                      {item.icon} {item.label}
                    </div>
                  ))}
                </div>

                {/* Content mockup */}
                <div className="flex-1 bg-slate-50 p-4 overflow-hidden">
                  {/* Header mock */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="h-4 w-28 bg-slate-200 rounded animate-pulse mb-1.5" />
                      <div className="h-3 w-44 bg-slate-100 rounded animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white rounded-xl border border-slate-200 flex items-center justify-center">
                        <Bell size={14} className="text-slate-400" />
                      </div>
                      <div className="w-8 h-8 bg-primary-600 rounded-full" />
                    </div>
                  </div>

                  {/* Metric cards mock */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {[
                      { label: 'Receita', val: 'R$ 48.7k', color: 'bg-primary-600' },
                      { label: 'Clientes', val: '234', color: 'bg-emerald-500' },
                      { label: 'Produtos', val: '89', color: 'bg-amber-500' },
                      { label: 'Ticket', val: 'R$ 850', color: 'bg-violet-500' },
                    ].map((card) => (
                      <div key={card.label} className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
                        <div className={`w-7 h-7 ${card.color} rounded-xl mb-2 flex items-center justify-center`}>
                          <TrendingUp size={12} className="text-white" />
                        </div>
                        <p className="text-xs text-slate-400 mb-0.5">{card.label}</p>
                        <p className="font-display font-bold text-sm text-slate-900">{card.val}</p>
                      </div>
                    ))}
                  </div>

                  {/* Chart mock */}
                  <div className="bg-white rounded-xl border border-slate-100 p-3 mb-3">
                    <div className="h-3 w-24 bg-slate-200 rounded mb-3" />
                    <div className="flex items-end gap-2 h-20">
                      {[40, 65, 50, 80, 60, 90].map((h, i) => (
                        <div key={i} className="flex-1 bg-primary-100 rounded-t" style={{ height: `${h}%` }}>
                          <div className="w-full bg-primary-500 rounded-t" style={{ height: `${h * 0.6}%` }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Table mock */}
                  <div className="bg-white rounded-xl border border-slate-100 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-3 w-28 bg-slate-200 rounded" />
                      <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Search size={10} className="text-slate-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[70, 50, 85, 60].map((w, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 shrink-0" />
                          <div className="h-2.5 bg-slate-100 rounded" style={{ width: `${w}%` }} />
                          <div className="ml-auto h-4 w-12 bg-emerald-100 rounded-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function LogosSection() {
  const logos = ['Shopify', 'Salesforce', 'HubSpot', 'Pipedrive', 'Monday', 'Notion', 'Slack']
  return (
    <section className="py-14 border-y border-slate-100 bg-slate-50/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-8">
          Integra com as ferramentas que você já usa
        </p>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
          {logos.map((logo) => (
            <span key={logo} className="font-display font-bold text-lg text-slate-300 hover:text-slate-400 transition-colors cursor-default">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  return (
    <section id="recursos" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div {...fadeUp()} className="max-w-2xl mx-auto text-center mb-16">
          <span className="inline-block text-xs font-semibold text-primary-600 uppercase tracking-widest mb-3">Recursos</span>
          <h2 className="font-display text-4xl font-bold text-slate-900 mb-4 leading-tight">
            Tudo que você precisa para escalar
          </h2>
          <p className="text-lg text-slate-500">
            De startups a enterprise — o Nexus cresce com o seu negócio sem complexidade desnecessária.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} {...fadeUp(i * 0.07)} className="group p-6 rounded-2xl border border-slate-100 bg-white hover:border-primary-100 hover:shadow-card-hover transition-all duration-200 cursor-default">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 ${ICON_COLORS[f.color]} transition-transform group-hover:scale-110 duration-200`}>
                {f.icon}
              </div>
              <h3 className="font-display font-semibold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function BenefitsSection() {
  const benefits = [
    { icon: <TrendingUp size={20} />, title: '+40%', sub: 'de produtividade média' },
    { icon: <Users size={20} />, title: '10K+', sub: 'empresas ativas' },
    { icon: <Star size={20} />, title: '4.9/5', sub: 'avaliação média' },
    { icon: <Shield size={20} />, title: '99.9%', sub: 'uptime garantido' },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <h2 className="font-display text-4xl font-bold text-white mb-3">Números que comprovam</h2>
          <p className="text-primary-200 text-lg">Resultados reais de quem já usa o Nexus</p>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => (
            <motion.div key={b.title} {...fadeUp(i * 0.08)} className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white mx-auto mb-3">{b.icon}</div>
              <p className="font-display text-3xl font-bold text-white mb-1">{b.title}</p>
              <p className="text-primary-200 text-sm">{b.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function IntegrationsSection() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <motion.div {...fadeUp()}>
          <span className="inline-block text-xs font-semibold text-primary-600 uppercase tracking-widest mb-3">Integrações</span>
          <h2 className="font-display text-4xl font-bold text-slate-900 mb-4">Conecte tudo que você já usa</h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto mb-12">
            Mais de 50 integrações nativas. Configure em minutos, sem código.
          </p>
        </motion.div>
        <motion.div {...fadeUp(0.1)} className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
          {INTEGRATIONS.map((int) => (
            <div key={int} className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:border-primary-200 hover:shadow-card-hover transition-all cursor-default">
              <div className="w-5 h-5 bg-gradient-to-br from-primary-400 to-primary-600 rounded-md" />
              {int}
            </div>
          ))}
          <div className="flex items-center gap-2 bg-primary-50 border border-primary-100 rounded-2xl px-4 py-2.5 text-sm font-medium text-primary-600">
            <Layers size={14} />
            +40 mais
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function PricingSection() {
  return (
    <section id="precos" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div {...fadeUp()} className="max-w-2xl mx-auto text-center mb-16">
          <span className="inline-block text-xs font-semibold text-primary-600 uppercase tracking-widest mb-3">Preços</span>
          <h2 className="font-display text-4xl font-bold text-slate-900 mb-4">Simples e transparente</h2>
          <p className="text-lg text-slate-500">Sem custos ocultos. Troque de plano quando quiser.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              {...fadeUp(i * 0.1)}
              className={`relative rounded-2xl border p-7 flex flex-col ${
                plan.highlight
                  ? 'bg-primary-600 border-primary-600 shadow-2xl shadow-primary-600/25 scale-[1.03]'
                  : 'bg-white border-slate-200 hover:border-primary-200 hover:shadow-card-hover transition-all'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                    Mais popular
                  </span>
                </div>
              )}
              <div className="mb-5">
                <h3 className={`font-display font-bold text-lg mb-1 ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.highlight ? 'text-primary-200' : 'text-slate-500'}`}>{plan.desc}</p>
                <div className="flex items-baseline gap-1">
                  <span className={`font-display text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.highlight ? 'text-primary-200' : 'text-slate-400'}`}>{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-2.5 mb-7 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className={`flex items-center gap-2.5 text-sm ${plan.highlight ? 'text-primary-100' : 'text-slate-600'}`}>
                    <Check size={14} className={plan.highlight ? 'text-primary-300' : 'text-emerald-500'} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`block text-center font-semibold text-sm px-5 py-3.5 rounded-xl transition-all ${
                  plan.highlight
                    ? 'bg-white text-primary-600 hover:bg-primary-50'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <span className="inline-block text-xs font-semibold text-primary-600 uppercase tracking-widest mb-3">Depoimentos</span>
          <h2 className="font-display text-4xl font-bold text-slate-900 mb-3">O que nossos clientes dizem</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={t.name} {...fadeUp(i * 0.1)} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-card hover:shadow-card-hover transition-all">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 text-sm leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-medium text-sm text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <span className="inline-block text-xs font-semibold text-primary-600 uppercase tracking-widest mb-3">FAQ</span>
          <h2 className="font-display text-4xl font-bold text-slate-900">Perguntas frequentes</h2>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div key={i} {...fadeUp(i * 0.06)} className="border border-slate-200 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="font-medium text-slate-900 pr-4">{faq.q}</span>
                {open === i
                  ? <ChevronUp size={18} className="text-primary-600 shrink-0" />
                  : <ChevronDown size={18} className="text-slate-400 shrink-0" />
                }
              </button>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-6 pb-5 text-sm text-slate-500 leading-relaxed border-t border-slate-100"
                >
                  <p className="pt-4">{faq.a}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-primary-600/20 blur-3xl rounded-full" />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <motion.div {...fadeUp()}>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            Pronto para transformar seu negócio?
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            Comece gratuitamente hoje. Sem cartão, sem compromisso.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-primary-600/30 hover:-translate-y-0.5 text-base"
            >
              Começar gratuitamente <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-8 py-4 rounded-2xl border border-white/10 transition-all text-base"
            >
              Já tenho conta
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Footer() {
  const cols = [
    { title: 'Produto', links: ['Dashboard', 'CRM', 'Produtos', 'Relatórios', 'API'] },
    { title: 'Empresa', links: ['Sobre', 'Blog', 'Carreiras', 'Imprensa', 'Parceiros'] },
    { title: 'Suporte', links: ['Documentação', 'Tutoriais', 'Status', 'Contato', 'Comunidade'] },
    { title: 'Legal', links: ['Privacidade', 'Termos', 'LGPD', 'Cookies', 'Licenças'] },
  ]

  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <span className="font-display font-bold text-lg text-white">Nexus</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              CRM inteligente para equipes que querem crescer com eficiência e clareza.
            </p>
            <div className="flex gap-3">
              {['in', 'tw', 'ig', 'yt'].map((s) => (
                <a key={s} href="#" className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center text-xs font-mono font-bold transition-colors">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-white text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm hover:text-white transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">© 2026 Nexus Systems. Todos os direitos reservados.</p>
          <p className="text-xs">Feito com ❤️ no Brasil · CNPJ 00.000.000/0001-00</p>
        </div>
      </div>
    </footer>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans">
      <Navbar />
      <HeroSection />
      <LogosSection />
      <FeaturesSection />
      <BenefitsSection />
      <IntegrationsSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  )
}
