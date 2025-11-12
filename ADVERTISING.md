# Advertising System Documentation

## Overview

The advertising system displays rotating sponsor slots on both desktop and mobile devices across all pages, including cached pages.

## Features

- **Desktop**: Fixed sidebar with rotating ads (4 spots, 10-second rotation)
- **Mobile**: Auto-hiding header banner with gradient background
- **Modal**: Professional purchase interface with integrated Stripe Buy Button
- **Client-side**: Works on all pages including statically cached pages

## Components

### 1. Ad Configuration (`lib/ads-config.ts`)
Central configuration for all advertising settings:
- `AD_SPOTS`: Array of 4 advertising spots
- `AD_CONFIG`: Settings for total spots, available spots, price, rotation interval, and Stripe credentials

### 2. Ad Sidebar (`components/ad-sidebar.tsx`)
Desktop advertisement component:
- Fixed position on the right side (hidden on mobile)
- Rotates through 4 ad spots every 10 seconds
- Shows indicator dots and availability counter
- Clicks open the purchase modal

### 3. Ad Mobile Banner (`components/ad-mobile-banner.tsx`)
Mobile advertisement component:
- Sticky header banner (hidden on desktop)
- Auto-hides when scrolling down, shows when scrolling up
- Gradient background with progress bar
- Dismissible close button

### 4. Ad Modal (`components/ad-modal.tsx`)
Purchase modal with:
- Feature list and benefits
- Availability status
- Integrated Stripe Buy Button
- Terms and contact information

### 5. Ad Provider (`components/ad-provider.tsx`)
Wrapper component that manages all ad components and modal state.

## Managing Advertisements

### Adding a New Advertiser

Edit `lib/ads-config.ts` and update the `AD_SPOTS` array:

```typescript
{
  id: 1,
  name: "Company Name",
  logo: "🚀", // Can use emoji or image URL
  tagline: "Brief tagline",
  url: "https://company.com",
  available: false // Set to false when spot is sold
}
```

### Updating Available Spots

Edit `AD_CONFIG.availableSpots` in `lib/ads-config.ts`:

```typescript
export const AD_CONFIG = {
  totalSpots: 20,
  availableSpots: 3, // Update this number
  price: 99,
  // ...
}
```

### Updating Stripe Settings

To change Stripe credentials, update `AD_CONFIG` in `lib/ads-config.ts`:

```typescript
stripeBuyButtonId: "buy_btn_YOUR_BUTTON_ID",
stripePublishableKey: "pk_live_YOUR_PUBLISHABLE_KEY"
```

### Changing Rotation Speed

Update `rotationInterval` in `lib/ads-config.ts` (value in milliseconds):

```typescript
rotationInterval: 10000, // 10 seconds
```

### Changing Price

Update `price` in `lib/ads-config.ts`:

```typescript
price: 99, // $99/month
```

## Testing

1. **Desktop View**: Open http://localhost:3000 on a desktop browser
   - Check the right sidebar for rotating ads
   - Verify ads rotate every 10 seconds
   - Click to open the modal

2. **Mobile View**: Open http://localhost:3000 on a mobile browser or use DevTools mobile emulation
   - Check the top banner for ads
   - Scroll down/up to test auto-hide behavior
   - Test the close button
   - Click to open the modal

3. **Modal**:
   - Verify all content displays correctly
   - Test the Stripe Buy Button
   - Check responsive layout

## Deployment Notes

- The advertising system is client-side only and works on all pages including cached pages
- No server-side rendering required
- Stripe Buy Button script loads dynamically when the modal opens
- TypeScript declarations for Stripe web component are in `types/stripe.d.ts`

## Contact

For advertising inquiries: advertise@albumartworkfinder.com
