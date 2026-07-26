import React, { useState, useEffect } from 'react'
import { Button } from '@components/index'

interface CookieBannerProps {
  onOpenPrivacy?: () => void
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenPrivacy }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookie_consent')
    if (!cookieConsent) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark/95 border-t border-gray-800 p-4 md:p-6 shadow-2xl z-50 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted text-center md:text-left">
          <p className="font-semibold text-light mb-1">🍪 Valorizamos sua privacidade</p>
          <p>
            Utilizamos cookies para personalizar anúncios e melhorar sua experiência no site.
            Ao continuar jogando, você concorda com o uso de cookies. Leia nossa{' '}
            <button 
              onClick={onOpenPrivacy} 
              className="text-secondary underline hover:opacity-80 font-medium"
            >
              Política de Privacidade
            </button>.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-center">
          <Button 
            variant="outline" 
            className="text-xs py-2 px-4 w-1/2 md:w-auto" 
            onClick={handleDecline}
          >
            Recusar
          </Button>
          <Button 
            variant="primary" 
            className="text-xs py-2 px-4 w-1/2 md:w-auto" 
            onClick={handleAccept}
          >
            Aceitar Cookies
          </Button>
        </div>
      </div>
    </div>
  )
}