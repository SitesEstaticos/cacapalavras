// Componentes base do jogo

import React from 'react'

interface CellProps {
  letter: string
  isSelected: boolean
  isFound: boolean
  isHinted?: boolean
  isError: boolean
  foundColor?: string
}

export const Cell: React.FC<CellProps> = ({
  letter,
  isSelected,
  isFound,
  isHinted = false,
  isError,
  foundColor,
}) => {
  // A célula SEMPRE deve manter 'cell-default' como classe base
  let className = 'cell-default'

  if (isError) {
    className += ' cell-error'
  } else if (isFound) {
    className += ' cell-found'
  } else if (isSelected) {
    className += ' cell-selected'
  }

  // Adiciona 'cell-hinted' cumulativamente se a dica estiver ativa e a palavra ainda não foi achada
  if (isHinted && !isFound) {
    className += ' cell-hinted'
  }

  return (
    <div
      className={className}
      style={
        isFound && foundColor && !isHinted
          ? { backgroundColor: foundColor, borderColor: foundColor }
          : undefined
      }
      role="button"
      tabIndex={0}
      aria-label={`Letter ${letter}`}
    >
      {letter}
    </div>
  )
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const variantClass = `btn-${variant}`
  const sizeClass =
    {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg',
    }[size] || ''

  return (
    <button className={`${variantClass} ${sizeClass} ${className}`} {...props}>
      {children}
    </button>
  )
}

interface CardProps {
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return <div className={`card-lg ${className}`}>{children}</div>
}

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success'
  children: React.ReactNode
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'primary', children }) => {
  const variantClass = `badge-${variant}`
  return <div className={`badge ${variantClass}`}>{children}</div>
}

interface HUDItemProps {
  label: string
  value: string | number
}

export const HUDItem: React.FC<HUDItemProps> = ({ label, value }) => {
  return (
    <div className="hud-section">
      <span className="hud-label">{label}</span>
      <span className="hud-value">{value}</span>
    </div>
  )
}

interface TimerProps {
  seconds: number
}

export const Timer: React.FC<TimerProps> = ({ seconds }) => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  const formatted = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`

  return <HUDItem label="Tempo" value={formatted} />
}

interface ProgressBarProps {
  current: number
  total: number
  animated?: boolean
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, animated = true }) => {
  const percentage = Math.round((current / total) * 100)

  return (
    <div className="w-full bg-white bg-opacity-10 rounded-full h-2 overflow-hidden">
      <div
        className={`h-full bg-secondary transition-all duration-300 ${
          animated ? 'animate-pulse-soft' : ''
        }`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

interface TooltipProps {
  text: string
  children: React.ReactNode
}

export const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  return (
    <div className="relative group inline-block">
      {children}
      <div className="tooltip opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {text}
      </div>
    </div>
  )
}