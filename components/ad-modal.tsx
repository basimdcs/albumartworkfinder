"use client"

import { useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { AD_CONFIG } from "@/lib/ads-config"

interface AdModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdModal({ isOpen, onClose }: AdModalProps) {
  useEffect(() => {
    // Load Stripe Buy Button script dynamically when modal opens
    if (isOpen) {
      const script = document.createElement('script')
      script.src = 'https://js.stripe.com/v3/buy-button.js'
      script.async = true
      document.body.appendChild(script)

      // Track Google Analytics add_to_cart event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'add_to_cart', {
          currency: 'USD',
          value: AD_CONFIG.price,
          items: [{
            item_id: 'ad_spot',
            item_name: 'AlbumArtworkFinder Ad Spot',
            item_category: 'Advertising',
            price: AD_CONFIG.price,
            quantity: 1
          }]
        })
      }

      return () => {
        // Cleanup script when modal closes
        if (document.body.contains(script)) {
          document.body.removeChild(script)
        }
      }
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="flex justify-center py-8">
          <stripe-buy-button
            buy-button-id={AD_CONFIG.stripeBuyButtonId}
            publishable-key={AD_CONFIG.stripePublishableKey}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
