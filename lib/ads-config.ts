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
  stripeBuyButtonId: "buy_btn_1SSfAMBPUj1Bqh7pymQsdbrn",
  stripePublishableKey: "pk_live_51J6CrJBPUj1Bqh7pQI8qk7i56wdBeQ8KFxeUoyzAlxzbbgkZIf9DPMaRLkrsekzsAbWs1VVt1om9n1PoTYJ0BkhQ00GyJrwhWy"
}
