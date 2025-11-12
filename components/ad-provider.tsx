"use client"

import { useState } from "react"
import AdSidebar from "./ad-sidebar"
import AdMobileBanner from "./ad-mobile-banner"
import AdModal from "./ad-modal"

export default function AdProvider() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleAdClick = () => {
    setIsModalOpen(true)
  }

  return (
    <>
      <AdSidebar onAdClick={handleAdClick} />
      <AdMobileBanner onAdClick={handleAdClick} />
      <AdModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
