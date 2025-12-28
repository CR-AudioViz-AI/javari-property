// CravManage Pricing Page
// AI-Powered Property Management That Actually Works

import Link from 'next/link'
import { 
  Building2, CheckCircle2, ArrowRight, Users, Shield, 
  Zap, BarChart3, Clock, Home, Key, Wrench, DollarSign,
  FileText, Bell, MessageSquare, Calendar, CreditCard,
  Star, Sparkles, Lock, Phone
} from 'lucide-react'

const pricingPlans = [
  {
    name: 'Starter',
    tagline: 'For New Landlords',
    price: 49,
    annual: 490,
    units: 'Up to 10 units',
    color: 'from-slate-500 to-slate-600',
    features: [
      'Tenant Screening (5/mo)',
      'Online Rent Collection',
      'Maintenance Requests',
      'Basic Reporting',
      'Tenant Portal',
      'Email Support',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Professional',
    tagline: 'Most Popular',
    price: 149,
    annual: 1490,
    units: 'Up to 50 units',
    color: 'from-violet-500 to-violet-600',
    features: [
      'Unlimited Tenant Screening',
      'Automated Rent Collection',
      'AI Maintenance Triage',
      'Advanced Analytics',
      'Owner Portal',
      'Lease Management',
      'Document Storage',
      'Priority Support',
      '200 AI Credits/mo',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    tagline: 'For Property Managers',
    price: 399,
    annual: 3990,
    units: 'Unlimited units',
    color: 'from-amber-500 to-amber-600',
    features: [
      'Everything in Professional',
      'Multi-Property Dashboard',
      'Team Management',
      'Custom Branding',
      'API Access',
      'Accounting Integration',
      'CAM Reconciliation',
      'Dedicated Account Manager',
      '1,000 AI Credits/mo',
      'White-Label Option',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

const competitors = [
  { name: 'CravManage', price: '$49-399', setup: 'FREE', units: 'Unlimited', ai: true, contract: 'Month-to-month' },
  { name: 'AppFolio', price: '$1.40/unit', setup: '$400+', units: 'Min 50', ai: false, contract: '12 months' },
  { name: 'Buildium', price: '$58-375', setup: 'Varies', units: 'Tiered', ai: false, contract: 'Annual' },
  { name: 'Rent Manager', price: 'Quote', setup: '$500+', units: 'Varies', ai: false, contract: '12 months' },
  { name: 'Yardi Breeze', price: '$1/unit', setup: 'FREE', units: 'Min 25', ai: false, contract: 'Month-to-month' },
]

const features = [
  {
    icon: Users,
    title: 'AI Tenant Screening',
    description: 'Credit, background, and eviction checks with AI-powered risk scoring. Know who you\'re renting to.',
  },
  {
    icon: CreditCard,
    title: 'Automated Rent Collection',
    description: 'ACH, credit card, and Apple Pay. Auto-reminders, late fees, and instant deposits.',
  },
  {
    icon: Wrench,
    title: 'AI Maintenance Triage',
    description: 'Tenants describe issues, AI categorizes urgency and routes to the right vendor.',
  },
  {
    icon: FileText,
    title: 'Digital Lease Management',
    description: 'E-signatures, auto-renewals, rent increase notices. Never miss a deadline.',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Occupancy, cash flow, maintenance costs. Know your numbers instantly.',
  },
  {
    icon: MessageSquare,
    title: 'Tenant Communication Hub',
    description: 'Announcements, maintenance updates, and secure messaging. All in one place.',
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">CravManage</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/features" className="text-slate-300 hover:text-white">Features</Link>
            <Link href="/pricing" className="text-white font-medium">Pricing</Link>
            <Link href="/login" className="text-slate-300 hover:text-white">Login</Link>
            <Link href="/signup" className="bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded-lg">
              Start Free Trial
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="py-16 px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-2 mb-6">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span className="text-violet-400 text-sm font-medium">60% Less Than AppFolio</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Property Management<br />
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Without the Headache
          </span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          AI-powered tools that handle tenant screening, rent collection, and maintenance - 
          so you can focus on growing your portfolio.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative rounded-2xl p-8 ${
                plan.popular 
                  ? 'bg-violet-500/10 border-2 border-violet-500' 
                  : 'bg-slate-800/50 border border-slate-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-violet-500 text-white text-sm font-medium px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <p className="text-slate-400 text-sm">{plan.tagline}</p>
              </div>
              
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-slate-400">/mo</span>
                </div>
                <p className="text-emerald-400 text-sm">${plan.annual}/yr (2 months free)</p>
                <p className="text-slate-500 text-sm mt-1">{plan.units}</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link 
                href={plan.name === 'Enterprise' ? '/contact' : '/signup'}
                className={`block text-center py-3 px-6 rounded-lg font-semibold transition ${
                  plan.popular 
                    ? 'bg-violet-500 hover:bg-violet-600 text-white' 
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Competitor Comparison */}
      <section className="py-16 px-4 bg-slate-800/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            See How We Compare
          </h2>
          <p className="text-slate-400 text-center mb-12">
            More features. Better AI. Lower price. No contest.
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-4 py-3 text-left text-slate-400">Platform</th>
                  <th className="px-4 py-3 text-center text-slate-400">Price</th>
                  <th className="px-4 py-3 text-center text-slate-400">Setup Fee</th>
                  <th className="px-4 py-3 text-center text-slate-400">AI Features</th>
                  <th className="px-4 py-3 text-center text-slate-400">Contract</th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((comp, i) => (
                  <tr 
                    key={i}
                    className={`border-b border-slate-700/50 ${
                      comp.name === 'CravManage' ? 'bg-violet-500/10' : ''
                    }`}
                  >
                    <td className={`px-4 py-4 font-semibold ${
                      comp.name === 'CravManage' ? 'text-violet-400' : 'text-white'
                    }`}>
                      {comp.name}
                      {comp.name === 'CravManage' && (
                        <span className="ml-2 text-xs bg-violet-500 text-white px-2 py-0.5 rounded">BEST</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center text-slate-300">{comp.price}</td>
                    <td className={`px-4 py-4 text-center ${
                      comp.setup === 'FREE' ? 'text-emerald-400' : 'text-slate-300'
                    }`}>
                      {comp.setup}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {comp.ai ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                      ) : (
                        <span className="text-red-400">✗</span>
                      )}
                    </td>
                    <td className={`px-4 py-4 text-center ${
                      comp.contract === 'Month-to-month' ? 'text-emerald-400' : 'text-slate-300'
                    }`}>
                      {comp.contract}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Everything You Need to Manage Properties
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <div className="w-12 h-12 rounded-lg bg-violet-500/20 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-violet-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-violet-600 to-cyan-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Simplify Property Management?
          </h2>
          <p className="text-white/90 mb-8">
            Join thousands of landlords who switched and never looked back. 
            14-day free trial, no credit card required.
          </p>
          <Link 
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-violet-600 font-bold py-4 px-8 rounded-xl hover:bg-slate-100 transition"
          >
            Start Free Trial <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © 2025 CravManage. Part of the{' '}
            <a href="https://cravproperty.com" className="text-violet-400 hover:text-violet-300">
              CravProperty Ecosystem
            </a>
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="https://craudiovizai.com/privacy" className="hover:text-white">Privacy</a>
            <a href="https://craudiovizai.com/terms" className="hover:text-white">Terms</a>
            <a href="https://craudiovizai.com/contact" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
