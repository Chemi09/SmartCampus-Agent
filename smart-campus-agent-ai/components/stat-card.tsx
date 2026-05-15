'use client'

import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    label: string
  }
  className?: string
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
  variant = 'default',
}: StatCardProps) {
  const variantStyles = {
    default: 'bg-card',
    success: 'bg-accent/10 border-accent/20',
    warning: 'bg-warning/10 border-warning/20',
    danger: 'bg-destructive/10 border-destructive/20',
  }

  const getTrendIcon = () => {
    if (!trend) return null
    if (trend.value > 0) return <TrendingUp className="h-3 w-3" />
    if (trend.value < 0) return <TrendingDown className="h-3 w-3" />
    return <Minus className="h-3 w-3" />
  }

  const getTrendColor = () => {
    if (!trend) return ''
    if (trend.value > 0) return 'text-accent'
    if (trend.value < 0) return 'text-destructive'
    return 'text-muted-foreground'
  }

  return (
    <Card className={cn('transition-all hover:shadow-lg', variantStyles[variant], className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <div className="flex items-center gap-2 mt-1">
            {trend && (
              <span className={cn('flex items-center gap-1 text-xs font-medium', getTrendColor())}>
                {getTrendIcon()}
                {Math.abs(trend.value)}%
              </span>
            )}
            {description && (
              <CardDescription className="text-xs">{description}</CardDescription>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface StatGridProps {
  children: React.ReactNode
  className?: string
}

export function StatGrid({ children, className }: StatGridProps) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {children}
    </div>
  )
}
