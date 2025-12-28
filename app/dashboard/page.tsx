// CravManage Dashboard
// The Command Center for Property Management

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Building2, Home, Users, DollarSign, Wrench, Bell, 
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
  Calendar, MessageSquare, FileText, Settings, LogOut,
  Plus, Search, Filter, MoreVertical, ArrowRight,
  CreditCard, Key, BarChart3, Clock
} from 'lucide-react'

// Mock data - in production this comes from API/Supabase
const mockStats = {
  totalUnits: 24,
  occupiedUnits: 22,
  occupancyRate: 91.7,
  monthlyRevenue: 42500,
  pendingRent: 3200,
  maintenanceRequests: 5,
  upcomingLeases: 3,
}

const mockProperties = [
  { id: 1, name: 'Sunset Apartments', units: 12, occupied: 11, revenue: 18500, city: 'Fort Myers' },
  { id: 2, name: 'Palm Gardens', units: 8, occupied: 8, revenue: 14000, city: 'Cape Coral' },
  { id: 3, name: '123 Main Street', units: 4, occupied: 3, revenue: 10000, city: 'Naples' },
]

const mockMaintenance = [
  { id: 1, property: 'Sunset Apartments', unit: '204', issue: 'AC not cooling', priority: 'high', created: '2 hours ago' },
  { id: 2, property: 'Palm Gardens', unit: '101', issue: 'Leaky faucet', priority: 'medium', created: '1 day ago' },
  { id: 3, property: '123 Main Street', unit: 'B', issue: 'Garbage disposal broken', priority: 'low', created: '2 days ago' },
]

const mockActivity = [
  { type: 'payment', message: 'Rent received from Unit 305 - $1,450', time: '10 min ago' },
  { type: 'maintenance', message: 'Work order #1234 completed', time: '1 hour ago' },
  { type: 'lease', message: 'Lease renewal signed - Unit 102', time: '3 hours ago' },
  { type: 'alert', message: 'Late rent notice sent - Unit 204', time: '5 hours ago' },
]

export default function DashboardPage() {
  const [stats, setStats] = useState(mockStats)
  const [properties, setProperties] = useState(mockProperties)
  const [maintenance, setMaintenance] = useState(mockMaintenance)
  const [activity, setActivity] = useState(mockActivity)

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">CravManage</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-violet-500/20 text-violet-400">
            <BarChart3 className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/dashboard/properties" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-700/50 hover:text-white transition">
            <Home className="w-5 h-5" />
            <span>Properties</span>
          </Link>
          <Link href="/dashboard/tenants" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-700/50 hover:text-white transition">
            <Users className="w-5 h-5" />
            <span>Tenants</span>
          </Link>
          <Link href="/dashboard/maintenance" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-700/50 hover:text-white transition">
            <Wrench className="w-5 h-5" />
            <span>Maintenance</span>
            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">5</span>
          </Link>
          <Link href="/dashboard/finances" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-700/50 hover:text-white transition">
            <DollarSign className="w-5 h-5" />
            <span>Finances</span>
          </Link>
          <Link href="/dashboard/leases" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-700/50 hover:text-white transition">
            <FileText className="w-5 h-5" />
            <span>Leases</span>
          </Link>
          <Link href="/dashboard/messages" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-700/50 hover:text-white transition">
            <MessageSquare className="w-5 h-5" />
            <span>Messages</span>
          </Link>
        </nav>

        {/* Ecosystem Cross-Sell */}
        <div className="p-4 border-t border-slate-700">
          <p className="text-xs text-slate-500 mb-3">Ecosystem Apps</p>
          <div className="space-y-2">
            <a href="https://cravkey.com" className="flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition">
              <Key className="w-4 h-4" />
              <span>CravKey (Realtor CRM)</span>
            </a>
            <a href="https://rateunlock.com" className="flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition">
              <TrendingUp className="w-4 h-4" />
              <span>RateUnlock (Mortgages)</span>
            </a>
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-700">
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white transition">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
          <button className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-red-400 transition w-full">
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-slate-400">Welcome back! Here's your portfolio overview.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition">
              <Bell className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-2 bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded-lg transition">
              <Plus className="w-4 h-4" />
              Add Property
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 text-sm">Total Units</span>
              <Home className="w-5 h-5 text-slate-500" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalUnits}</p>
            <p className="text-emerald-400 text-sm">{stats.occupiedUnits} occupied</p>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 text-sm">Occupancy Rate</span>
              <Users className="w-5 h-5 text-slate-500" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.occupancyRate}%</p>
            <p className="text-emerald-400 text-sm flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> +2.3% this month
            </p>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 text-sm">Monthly Revenue</span>
              <DollarSign className="w-5 h-5 text-slate-500" />
            </div>
            <p className="text-3xl font-bold text-white">${stats.monthlyRevenue.toLocaleString()}</p>
            <p className="text-amber-400 text-sm">${stats.pendingRent.toLocaleString()} pending</p>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 text-sm">Open Requests</span>
              <Wrench className="w-5 h-5 text-slate-500" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.maintenanceRequests}</p>
            <p className="text-red-400 text-sm">2 high priority</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Properties List */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <h2 className="font-semibold text-white">Properties</h2>
              <Link href="/dashboard/properties" className="text-violet-400 text-sm hover:text-violet-300">
                View All
              </Link>
            </div>
            <div className="divide-y divide-slate-700">
              {properties.map((property) => (
                <div key={property.id} className="p-4 hover:bg-slate-700/30 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white">{property.name}</h3>
                      <p className="text-slate-400 text-sm">{property.city}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">${property.revenue.toLocaleString()}/mo</p>
                      <p className="text-slate-400 text-sm">{property.occupied}/{property.units} units</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance Requests */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <h2 className="font-semibold text-white">Maintenance Requests</h2>
              <Link href="/dashboard/maintenance" className="text-violet-400 text-sm hover:text-violet-300">
                View All
              </Link>
            </div>
            <div className="divide-y divide-slate-700">
              {maintenance.map((request) => (
                <div key={request.id} className="p-4 hover:bg-slate-700/30 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <span className={`w-2 h-2 rounded-full mt-2 ${
                        request.priority === 'high' ? 'bg-red-500' :
                        request.priority === 'medium' ? 'bg-amber-500' : 'bg-slate-500'
                      }`} />
                      <div>
                        <h3 className="font-medium text-white">{request.issue}</h3>
                        <p className="text-slate-400 text-sm">{request.property} - Unit {request.unit}</p>
                      </div>
                    </div>
                    <span className="text-slate-500 text-xs">{request.created}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl">
          <div className="p-4 border-b border-slate-700">
            <h2 className="font-semibold text-white">Recent Activity</h2>
          </div>
          <div className="divide-y divide-slate-700">
            {activity.map((item, i) => (
              <div key={i} className="p-4 flex items-center gap-4 hover:bg-slate-700/30 transition">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  item.type === 'payment' ? 'bg-emerald-500/20 text-emerald-400' :
                  item.type === 'maintenance' ? 'bg-violet-500/20 text-violet-400' :
                  item.type === 'lease' ? 'bg-cyan-500/20 text-cyan-400' :
                  'bg-amber-500/20 text-amber-400'
                }`}>
                  {item.type === 'payment' && <DollarSign className="w-5 h-5" />}
                  {item.type === 'maintenance' && <Wrench className="w-5 h-5" />}
                  {item.type === 'lease' && <FileText className="w-5 h-5" />}
                  {item.type === 'alert' && <Bell className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <p className="text-white">{item.message}</p>
                </div>
                <span className="text-slate-500 text-sm">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
