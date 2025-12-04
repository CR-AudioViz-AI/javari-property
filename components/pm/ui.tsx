// CR PROPERTY MANAGEMENT - SHARED UI COMPONENTS
// Created: December 3, 2025
// Design: Premium, Modern, Professional - Beats AppFolio/Buildium

'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon, ArrowUpRight, ArrowDownRight, MoreVertical, ChevronRight } from 'lucide-react';

// ============================================================================
// STAT CARD - For dashboard metrics
// ============================================================================

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: LucideIcon;
  iconColor?: string;
  href?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  change,
  changeType,
  icon: Icon,
  iconColor = 'text-blue-600 bg-blue-50',
  href,
  className = '',
}: StatCardProps) {
  const content = (
    <div className={`
      group relative bg-white rounded-2xl border border-gray-100 p-6
      hover:shadow-lg hover:shadow-gray-100/50 hover:border-gray-200
      transition-all duration-300 cursor-pointer
      ${className}
    `}>
      {/* Gradient Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {change && (
            <div className={`
              flex items-center gap-1 mt-2 text-sm font-medium
              ${changeType === 'positive' ? 'text-emerald-600' : 
                changeType === 'negative' ? 'text-red-500' : 
                'text-gray-500'}
            `}>
              {changeType === 'positive' && <ArrowUpRight className="w-4 h-4" />}
              {changeType === 'negative' && <ArrowDownRight className="w-4 h-4" />}
              <span>{change}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${iconColor}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

// ============================================================================
// STATUS BADGE - For lease/payment/maintenance status
// ============================================================================

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'pill' | 'dot';
  size?: 'sm' | 'md' | 'lg';
}

const statusStyles: Record<string, string> = {
  // Payment
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  late: 'bg-red-50 text-red-700 border-red-200',
  overdue: 'bg-red-50 text-red-700 border-red-200',
  partial: 'bg-blue-50 text-blue-700 border-blue-200',
  processing: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  
  // Lease
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  draft: 'bg-gray-50 text-gray-600 border-gray-200',
  expired: 'bg-red-50 text-red-700 border-red-200',
  expiring_soon: 'bg-amber-50 text-amber-700 border-amber-200',
  terminated: 'bg-red-50 text-red-700 border-red-200',
  month_to_month: 'bg-purple-50 text-purple-700 border-purple-200',
  
  // Maintenance
  submitted: 'bg-blue-50 text-blue-700 border-blue-200',
  acknowledged: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  scheduled: 'bg-purple-50 text-purple-700 border-purple-200',
  in_progress: 'bg-amber-50 text-amber-700 border-amber-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-gray-50 text-gray-600 border-gray-200',
  
  // Priority
  emergency: 'bg-red-100 text-red-800 border-red-300',
  urgent: 'bg-orange-50 text-orange-700 border-orange-200',
  high: 'bg-amber-50 text-amber-700 border-amber-200',
  medium: 'bg-blue-50 text-blue-700 border-blue-200',
  low: 'bg-gray-50 text-gray-600 border-gray-200',
  
  // Tenant
  prospect: 'bg-gray-50 text-gray-600 border-gray-200',
  applicant: 'bg-blue-50 text-blue-700 border-blue-200',
  screening: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  
  // Default
  default: 'bg-gray-50 text-gray-600 border-gray-200',
};

const dotColors: Record<string, string> = {
  paid: 'bg-emerald-500',
  pending: 'bg-amber-500',
  late: 'bg-red-500',
  active: 'bg-emerald-500',
  expired: 'bg-red-500',
  completed: 'bg-emerald-500',
  in_progress: 'bg-amber-500',
  emergency: 'bg-red-500',
  default: 'bg-gray-400',
};

export function StatusBadge({ status, variant = 'default', size = 'md' }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '_');
  const style = statusStyles[normalizedStatus] || statusStyles.default;
  const dotColor = dotColors[normalizedStatus] || dotColors.default;
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  const displayText = status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  if (variant === 'dot') {
    return (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${dotColor}`} />
        <span className="text-sm text-gray-700">{displayText}</span>
      </div>
    );
  }

  return (
    <span className={`
      inline-flex items-center font-medium rounded-full border
      ${style} ${sizeClasses[size]}
      ${variant === 'pill' ? 'rounded-full' : 'rounded-lg'}
    `}>
      {displayText}
    </span>
  );
}

// ============================================================================
// ACTION CARD - Quick actions with icons
// ============================================================================

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

export function ActionCard({ 
  title, 
  description, 
  icon: Icon, 
  href, 
  variant = 'default' 
}: ActionCardProps) {
  const variants = {
    default: {
      container: 'bg-white border-gray-100 hover:border-gray-200',
      icon: 'bg-gray-50 text-gray-600 group-hover:bg-gray-100',
    },
    primary: {
      container: 'bg-gradient-to-br from-blue-500 to-indigo-600 border-transparent text-white',
      icon: 'bg-white/20 text-white',
    },
    success: {
      container: 'bg-gradient-to-br from-emerald-500 to-teal-600 border-transparent text-white',
      icon: 'bg-white/20 text-white',
    },
    warning: {
      container: 'bg-gradient-to-br from-amber-400 to-orange-500 border-transparent text-white',
      icon: 'bg-white/20 text-white',
    },
  };

  const v = variants[variant];

  return (
    <Link
      href={href}
      className={`
        group relative block p-5 rounded-2xl border
        hover:shadow-lg hover:shadow-gray-100/50
        transition-all duration-300
        ${v.container}
      `}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${v.icon}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className={`font-semibold mb-1 ${variant === 'default' ? 'text-gray-900' : ''}`}>
        {title}
      </h3>
      <p className={`text-sm ${variant === 'default' ? 'text-gray-500' : 'opacity-90'}`}>
        {description}
      </p>
      <ChevronRight className={`
        absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5
        opacity-0 group-hover:opacity-100 group-hover:translate-x-1
        transition-all duration-300
        ${variant === 'default' ? 'text-gray-400' : 'text-white/70'}
      `} />
    </Link>
  );
}

// ============================================================================
// DATA TABLE - Reusable table component
// ============================================================================

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  onRowClick,
  emptyMessage = 'No data found',
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((item) => (
            <tr
              key={item.id}
              onClick={() => onRowClick?.(item)}
              className={`
                hover:bg-gray-50/50 transition-colors
                ${onRowClick ? 'cursor-pointer' : ''}
              `}
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-4 ${col.className || ''}`}>
                  {col.render ? col.render(item) : (item as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// ALERT CARD - For urgent notifications
// ============================================================================

interface AlertCardProps {
  title: string;
  description: string;
  type: 'emergency' | 'warning' | 'info' | 'success';
  time?: string;
  href?: string;
}

export function AlertCard({ title, description, type, time, href }: AlertCardProps) {
  const styles = {
    emergency: {
      container: 'bg-gradient-to-r from-red-50 to-red-50/50 border-l-4 border-l-red-500',
      dot: 'bg-red-500 animate-pulse',
    },
    warning: {
      container: 'bg-gradient-to-r from-amber-50 to-amber-50/50 border-l-4 border-l-amber-500',
      dot: 'bg-amber-500',
    },
    info: {
      container: 'bg-gradient-to-r from-blue-50 to-blue-50/50 border-l-4 border-l-blue-500',
      dot: 'bg-blue-500',
    },
    success: {
      container: 'bg-gradient-to-r from-emerald-50 to-emerald-50/50 border-l-4 border-l-emerald-500',
      dot: 'bg-emerald-500',
    },
  };

  const s = styles[type];

  const content = (
    <div className={`rounded-r-xl p-4 ${s.container}`}>
      <div className="flex items-start gap-3">
        <div className={`w-2 h-2 rounded-full mt-2 ${s.dot}`} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900">{title}</p>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
          {time && <p className="text-xs text-gray-400 mt-2">{time}</p>}
        </div>
        {href && <ChevronRight className="w-5 h-5 text-gray-400" />}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="block hover:opacity-90 transition-opacity">{content}</Link>;
  }
  return content;
}

// ============================================================================
// PROGRESS BAR - For occupancy, goals, etc.
// ============================================================================

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = 'blue',
  size = 'md',
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div>
      {(label || showPercentage) && (
        <div className="flex justify-between text-sm mb-1">
          {label && <span className="text-gray-600">{label}</span>}
          {showPercentage && <span className="font-medium text-gray-900">{percentage}%</span>}
        </div>
      )}
      <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${colors[color]} ${heights[size]} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// EMPTY STATE - When no data
// ============================================================================

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-gray-300" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

// ============================================================================
// DROPDOWN MENU
// ============================================================================

interface DropdownItem {
  label: string;
  icon?: LucideIcon;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'danger';
  divider?: boolean;
}

interface DropdownMenuProps {
  trigger?: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
}

export function DropdownMenu({ trigger, items, align = 'right' }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
      >
        {trigger || <MoreVertical className="w-5 h-5 text-gray-400" />}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className={`
            absolute z-20 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1
            ${align === 'right' ? 'right-0' : 'left-0'}
          `}>
            {items.map((item, i) => (
              <React.Fragment key={i}>
                {item.divider && <div className="h-px bg-gray-100 my-1" />}
                {item.href ? (
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-2 px-4 py-2 text-sm
                      ${item.variant === 'danger' 
                        ? 'text-red-600 hover:bg-red-50' 
                        : 'text-gray-700 hover:bg-gray-50'}
                    `}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    {item.label}
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      item.onClick?.();
                      setIsOpen(false);
                    }}
                    className={`
                      flex items-center gap-2 px-4 py-2 text-sm w-full text-left
                      ${item.variant === 'danger' 
                        ? 'text-red-600 hover:bg-red-50' 
                        : 'text-gray-700 hover:bg-gray-50'}
                    `}
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    {item.label}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================================
// AVATAR
// ============================================================================

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const colors = [
    'bg-blue-500',
    'bg-emerald-500',
    'bg-purple-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];

  const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`
      ${sizes[size]} ${colors[colorIndex]}
      rounded-full flex items-center justify-center text-white font-medium
      ${className}
    `}>
      {initials}
    </div>
  );
}

// ============================================================================
// LOADING SPINNER
// ============================================================================

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`${sizes[size]} ${className}`}>
      <div className="w-full h-full border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
}

// ============================================================================
// CARD WRAPPER
// ============================================================================

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className = '', padding = 'md' }: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
}

// ============================================================================
// SECTION HEADER
// ============================================================================

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
}

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          {action.label}
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
