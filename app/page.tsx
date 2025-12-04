import Link from 'next/link'
import {
  Building2,
  Users,
  FileText,
  Wrench,
  DollarSign,
  BarChart3,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Clock,
  TrendingUp,
  Home,
  Factory,
  Store,
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">CR Property</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Testimonials</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/tenant-portal" className="text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">
                Tenant Login
              </Link>
              <Link
                href="/property-management"
                className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-400/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Property Management
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Manage Properties
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Smarter, Not Harder
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              The only property management platform with AI-powered tenant screening, 
              predictive maintenance, and automated rent collection. Built for modern landlords.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/property-management"
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#demo"
                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all border border-gray-200 flex items-center justify-center gap-2"
              >
                Watch Demo
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '50K+', label: 'Units Managed' },
              { value: '98%', label: 'Rent Collection Rate' },
              { value: '24hrs', label: 'Avg Maintenance Response' },
              { value: '4.9/5', label: 'Customer Rating' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Properties
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From residential to commercial, our platform handles it all with intelligent automation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: 'AI Tenant Screening',
                description: 'Smart risk scoring analyzes 200+ data points to find the best tenants fast.',
                color: 'bg-purple-50 text-purple-600',
              },
              {
                icon: DollarSign,
                title: 'Automated Rent Collection',
                description: 'AutoPay, payment reminders, and instant late fee calculations.',
                color: 'bg-emerald-50 text-emerald-600',
              },
              {
                icon: Wrench,
                title: 'Smart Maintenance',
                description: 'AI diagnosis, vendor auto-dispatch, and predictive maintenance alerts.',
                color: 'bg-amber-50 text-amber-600',
              },
              {
                icon: FileText,
                title: 'Digital Leasing',
                description: 'E-signatures, template library, and automated renewal workflows.',
                color: 'bg-blue-50 text-blue-600',
              },
              {
                icon: BarChart3,
                title: 'Real-time Analytics',
                description: 'Dashboards, custom reports, and financial forecasting.',
                color: 'bg-indigo-50 text-indigo-600',
              },
              {
                icon: Shield,
                title: 'Tenant & Owner Portals',
                description: 'Self-service portals for tenants and transparent owner statements.',
                color: 'bg-rose-50 text-rose-600',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-8 rounded-2xl border border-gray-100 hover:shadow-xl hover:shadow-gray-100/50 transition-all group"
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Property Types */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built for Every Property Type
            </h2>
            <p className="text-xl text-gray-600">
              Residential, commercial, or industrial – we've got you covered
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Home,
                title: 'Residential',
                types: ['Single Family', 'Apartments', 'Condos', 'Townhouses', 'Student Housing'],
                color: 'from-emerald-500 to-teal-600',
              },
              {
                icon: Store,
                title: 'Commercial',
                types: ['Office Space', 'Retail', 'Restaurants', 'Medical', 'Mixed-Use'],
                color: 'from-blue-500 to-indigo-600',
              },
              {
                icon: Factory,
                title: 'Industrial',
                types: ['Warehouses', 'Manufacturing', 'Distribution', 'Flex Space', 'Cold Storage'],
                color: 'from-orange-500 to-amber-600',
              },
            ].map((type) => (
              <div
                key={type.title}
                className={`bg-gradient-to-br ${type.color} rounded-2xl p-8 text-white`}
              >
                <type.icon className="w-12 h-12 mb-6" />
                <h3 className="text-2xl font-bold mb-4">{type.title}</h3>
                <ul className="space-y-2">
                  {type.types.map((t) => (
                    <li key={t} className="flex items-center gap-2 text-white/90">
                      <CheckCircle className="w-4 h-4" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              No hidden fees. No long-term contracts. Scale as you grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Starter',
                price: 49,
                units: '1-25 units',
                features: [
                  'Property & unit management',
                  'Tenant & lease tracking',
                  'Online rent collection',
                  'Maintenance requests',
                  'Basic reporting',
                  'Email support',
                ],
                cta: 'Start Free Trial',
                popular: false,
              },
              {
                name: 'Professional',
                price: 99,
                units: '26-100 units',
                features: [
                  'Everything in Starter',
                  'AI tenant screening',
                  'Tenant & owner portals',
                  'E-signatures',
                  'Vendor management',
                  'Advanced analytics',
                  'Priority support',
                ],
                cta: 'Start Free Trial',
                popular: true,
              },
              {
                name: 'Enterprise',
                price: 199,
                units: '100+ units',
                features: [
                  'Everything in Professional',
                  'AI maintenance diagnosis',
                  'Predictive analytics',
                  'Custom integrations',
                  'API access',
                  'Dedicated account manager',
                  'SLA guarantee',
                ],
                cta: 'Contact Sales',
                popular: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 ${
                  plan.popular
                    ? 'bg-blue-600 text-white ring-4 ring-blue-600 ring-offset-4'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <span className="inline-block px-3 py-1 bg-amber-400 text-amber-900 text-sm font-semibold rounded-full mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className={`text-2xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${plan.popular ? 'text-blue-100' : 'text-gray-500'}`}>
                  {plan.units}
                </p>
                <div className="mt-4 mb-6">
                  <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    ${plan.price}
                  </span>
                  <span className={plan.popular ? 'text-blue-100' : 'text-gray-500'}>/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <CheckCircle className={`w-5 h-5 flex-shrink-0 ${plan.popular ? 'text-blue-200' : 'text-emerald-500'}`} />
                      <span className={plan.popular ? 'text-blue-100' : 'text-gray-600'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-white text-blue-600 hover:bg-blue-50'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-500 mt-8">
            Realtor Add-on: +$29/month for integrated property management
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Property Management?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join thousands of property managers who save 10+ hours per week with CR Property Management.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/property-management"
              className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
            >
              Start Your Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/tenant-portal"
              className="w-full sm:w-auto px-8 py-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-400 transition-all"
            >
              Tenant Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">CR Property</span>
            </div>
            <div className="flex items-center gap-8 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-sm">
              © 2025 CR AudioViz AI, LLC. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
