// CR PROPERTY MANAGEMENT - LAYOUT WITH SIDEBAR
// Created: December 3, 2025

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  Home,
  Users,
  FileText,
  Wrench,
  DollarSign,
  ClipboardCheck,
  Truck,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Bell,
  Search,
  HelpCircle,
  LogOut,
  User,
  Factory,
  Store,
  Sparkles,
  MessageSquare,
  Calendar,
  CreditCard,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react';

const mainNavigation = [
  { 
    name: 'Dashboard', 
    href: '/property-management', 
    icon: BarChart3,
    exact: true 
  },
  { 
    name: 'Properties', 
    href: '/property-management/properties', 
    icon: Building2,
  },
  { 
    name: 'Units', 
    href: '/property-management/units', 
    icon: Home,
  },
  { 
    name: 'Tenants', 
    href: '/property-management/tenants', 
    icon: Users,
  },
  { 
    name: 'Leases', 
    href: '/property-management/leases', 
    icon: FileText 
  },
  { 
    name: 'Payments', 
    href: '/property-management/payments', 
    icon: DollarSign 
  },
  { 
    name: 'Maintenance', 
    href: '/property-management/maintenance', 
    icon: Wrench,
  },
];

const secondaryNavigation = [
  { 
    name: 'Inspections', 
    href: '/property-management/inspections', 
    icon: ClipboardCheck 
  },
  { 
    name: 'Vendors', 
    href: '/property-management/vendors', 
    icon: Truck 
  },
  { 
    name: 'Reports', 
    href: '/property-management/reports', 
    icon: TrendingUp 
  },
  { 
    name: 'Calendar', 
    href: '/property-management/calendar', 
    icon: Calendar 
  },
  { 
    name: 'Messages', 
    href: '/property-management/messages', 
    icon: MessageSquare 
  },
];

const categoryFilters = [
  { name: 'All Properties', icon: Building2, filter: 'all' },
  { name: 'Residential', icon: Home, filter: 'residential' },
  { name: 'Commercial', icon: Store, filter: 'commercial' },
  { name: 'Industrial', icon: Factory, filter: 'industrial' },
];

export default function PropertyManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-100
        transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'}
      `}>
        {/* Sidebar Header */}
        <div className={`h-16 flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'justify-between px-5'} border-b border-gray-100`}>
          {!sidebarCollapsed && (
            <Link href="/property-management" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-gray-900 block">CR Property</span>
                <span className="text-xs text-gray-500">Management</span>
              </div>
            </Link>
          )}
          {sidebarCollapsed && (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-xl"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* AI Badge */}
        {!sidebarCollapsed && (
          <div className="mx-4 my-4">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-semibold text-indigo-900">AI Powered</span>
              </div>
              <p className="text-xs text-indigo-600">Smart insights & automation enabled</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className={`${sidebarCollapsed ? 'px-2' : 'px-3'} overflow-y-auto h-[calc(100vh-12rem)]`}>
          {/* Main Navigation */}
          <div className="space-y-1">
            {!sidebarCollapsed && (
              <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Main
              </p>
            )}
            {mainNavigation.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                    ${active 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                    ${sidebarCollapsed ? 'justify-center' : ''}
                  `}
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-blue-600' : ''}`} />
                  {!sidebarCollapsed && (
                    <span className="font-medium">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Secondary Navigation */}
          <div className="mt-6 space-y-1">
            {!sidebarCollapsed && (
              <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Management
              </p>
            )}
            {secondaryNavigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                    ${active 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                    ${sidebarCollapsed ? 'justify-center' : ''}
                  `}
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-blue-600' : ''}`} />
                  {!sidebarCollapsed && (
                    <span className="font-medium">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Category Filters */}
          {!sidebarCollapsed && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Filter by Type
              </p>
              {categoryFilters.map((item) => (
                <Link
                  key={item.name}
                  href={`/property-management/properties?category=${item.filter}`}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Settings */}
          <div className={`mt-6 pt-6 border-t border-gray-100 ${sidebarCollapsed ? '' : ''}`}>
            {!sidebarCollapsed && (
              <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Settings
              </p>
            )}
            <Link
              href="/property-management/settings"
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors
                ${sidebarCollapsed ? 'justify-center' : ''}
              `}
            >
              <Settings className="w-5 h-5" />
              {!sidebarCollapsed && <span className="font-medium">Settings</span>}
            </Link>
          </div>
        </nav>

        {/* Collapse Button (Desktop only) */}
        <div className="absolute bottom-4 left-0 right-0 px-3 hidden lg:block">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`
              w-full flex items-center justify-center gap-2 px-3 py-2.5 
              text-gray-500 hover:bg-gray-100 rounded-xl transition-colors
            `}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`
        transition-all duration-300
        ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}
      `}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-xl"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>

            {/* Search */}
            <div className="hidden sm:flex flex-1 max-w-lg mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search properties, tenants, units..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-400 text-xs rounded">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {/* AI Assistant */}
              <button className="hidden md:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                <Sparkles className="w-4 h-4" />
                Ask Javari
              </button>

              {/* Notifications */}
              <button className="p-2.5 hover:bg-gray-100 rounded-xl relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* Help */}
              <button className="p-2.5 hover:bg-gray-100 rounded-xl hidden sm:block">
                <HelpCircle className="w-5 h-5 text-gray-600" />
              </button>

              {/* Divider */}
              <div className="hidden sm:block w-px h-6 bg-gray-200 mx-2" />

              {/* User Menu */}
              <button className="flex items-center gap-3 p-1.5 hover:bg-gray-100 rounded-xl">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">Roy Henderson</p>
                  <p className="text-xs text-gray-500">Property Manager</p>
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
