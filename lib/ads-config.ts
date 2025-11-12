export interface AdSpot {
  id: number
  name: string
  logo: string
  tagline: string
  url: string
  available: boolean
}

export const AD_SPOTS: AdSpot[] = [
  {
    id: 1,
    name: "Advertise",
    logo: "📢",
    tagline: "Your brand here",
    url: "#advertise",
    available: true
  },
  {
    id: 2,
    name: "Advertise",
    logo: "📢",
    tagline: "Your brand here",
    url: "#advertise",
    available: true
  },
  {
    id: 3,
    name: "Advertise",
    logo: "📢",
    tagline: "Your brand here",
    url: "#advertise",
    available: true
  },
  {
    id: 4,
    name: "Advertise",
    logo: "📢",
    tagline: "Your brand here",
    url: "#advertise",
    available: true
  }
]

export const AD_CONFIG = {
  totalSpots: 5,
  availableSpots: 4,
  price: 99,
  rotationInterval: 10000, // 10 seconds
  stripeCheckoutUrl: "https://buy.stripe.com/bJe4gy0NWe2ufDIgUO"
}
