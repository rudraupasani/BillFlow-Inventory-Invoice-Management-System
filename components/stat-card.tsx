'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
  children?: ReactNode
  className?: string
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  children,
  className,
}: StatCardProps) {
  return (
    <Card className={`border-border ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && (
          <div className="p-2 bg-secondary rounded-md">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        {children ? (
          children
        ) : (
          <>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{value}</div>
              {trend && (
                <div
                  className={`text-xs font-medium px-2 py-0.5 rounded ${
                    trend.direction === 'up'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
                </div>
              )}
            </div>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </>
        )}
      </CardContent>
    </Card>
  )
}
