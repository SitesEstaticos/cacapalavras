import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

interface DisplayAdProps {
  slot: string
  format?: string
  responsive?: boolean
  className?: string
  style?: React.CSSProperties
}

export default function DisplayAd({
  slot,
  format = 'auto',
  responsive = true,
  className,
  style,
}: DisplayAdProps) {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return

    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      initialized.current = true
    } catch (error) {
      console.error('Erro ao carregar anúncio:', error)
    }
  }, [])

  return (
    <ins
      className={`adsbygoogle ${className ?? ''}`}
      style={{
        display: 'block',
        ...style,
      }}
      data-ad-client="ca-pub-9534764444507609"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive.toString()}
    />
  )
}