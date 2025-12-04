import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

export function getOccupancyColor(rate: number): string {
  if (rate >= 90) return 'emerald'
  if (rate >= 70) return 'amber'
  return 'red'
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    // Payment
    paid: 'emerald',
    pending: 'amber',
    late: 'red',
    overdue: 'red',
    partial: 'blue',
    
    // Lease
    active: 'emerald',
    draft: 'gray',
    expired: 'red',
    expiring_soon: 'amber',
    
    // Maintenance
    submitted: 'blue',
    scheduled: 'purple',
    in_progress: 'amber',
    completed: 'emerald',
    
    // Priority
    emergency: 'red',
    urgent: 'orange',
    high: 'amber',
    medium: 'blue',
    low: 'gray',
  }
  
  return statusColors[status.toLowerCase()] || 'gray'
}

export function generateRequestNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0')
  return `MR-${year}-${random}`
}

export function calculateLateFee(
  rentAmount: number,
  feeType: 'flat' | 'percentage' | 'daily',
  feeAmount: number,
  daysLate: number
): number {
  switch (feeType) {
    case 'flat':
      return feeAmount
    case 'percentage':
      return rentAmount * (feeAmount / 100)
    case 'daily':
      return feeAmount * daysLate
    default:
      return 0
  }
}

export function getDaysUntilDate(date: string | Date): number {
  const targetDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  targetDate.setHours(0, 0, 0, 0)
  const diffTime = targetDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
