"use client"

import { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { AD_CONFIG } from "@/lib/ads-config"

interface AdModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdModal({ isOpen, onClose }: AdModalProps) {
  useEffect(() => {
    // Load Stripe Buy Button script and track GA event when modal opens
    if (isOpen) {
      // Load Stripe script
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Advertise on AlbumArtworkFinder
          </DialogTitle>
          <DialogDescription className="text-base">
            Reach thousands of music enthusiasts and album collectors daily
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Description */}
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your brand appears in rotating sponsor slots on desktop banners and mobile
              banners across all AlbumArtworkFinder pages. Sponsors rotate every 10 seconds
              to ensure fair visibility.
            </p>
          </div>

          {/* Availability */}
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Available spots:</span>
              <span className="font-semibold text-orange-600">
                {AD_CONFIG.availableSpots} of {AD_CONFIG.totalSpots}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Price:</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                ${AD_CONFIG.price}/month
              </span>
            </div>
          </div>

          {/* Stripe Buy Button */}
          <div className="flex justify-center">
            <stripe-buy-button
              buy-button-id="buy_btn_1SSfAMBPUj1Bqh7pymQsdbrn"
              publishable-key="pk_live_51J6CrJBPUj1Bqh7pQI8qk7i56wdBeQ8KFxeUoyzAlxzbbgkZIf9DPMaRLkrsekzsAbWs1VVt1om9n1PoTYJ0BkhQ00GyJrwhWy"
            />
          </div>

          {/* Footer */}
          <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
            Questions? Contact us at advertise@albumartworkfinder.com
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
