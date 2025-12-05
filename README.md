# Dirty Roots - RootShare

A hybrid community content management platform with social network features, focused on plants and calm places. [1-cite-0](#1-cite-0) 

## 🌿 Description

Dirty Roots is a **multimodal platform** that combines:
- **Administrative CMS** for content management
- **Niche social network** focused on plants
- **Installable PWA** with offline capabilities
- **Marketplace** with discount system
- **Geospatial directory** of calm places
- **Embeddable widgets** for external sites

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 16.0.7 + React 19.2.0 + TypeScript
- **Backend**: Firebase (Firestore + Authentication + Admin SDK)
- **PWA**: next-pwa + Service Worker
- **Maps**: Leaflet + geofire-common
- **Forms**: react-hook-form + Zod
- **Desktop**: Electron 39.1.2

### Authentication Structure
The system implements **four access levels**: [1-cite-1](#1-cite-1) 

| Level | Component | Authentication | Access |
|-------|------------|---------------|--------|
| **Anonymous** | None | `signInAnonymously()` | Public widgets |
| **User** | `UserProtectedRoute` | Email/Password | Community |
| **Admin** | `ProtectedRoute` | Email/Password | Content CRUD |
| **Owner** | `OwnerRoute` | Email + Role check | Admin management |

## 📁 Project Structure

```
pwa/
├── app/
│   ├── page.tsx                 # Admin Console
│   ├── auth/page.tsx           # Admin login
│   ├── user-auth/page.tsx      # User login/registration
│   ├── community/
│   │   ├── herbarium/          # Plant gallery
│   │   ├── profile/            # User profiles
│   │   └── questions/          # Community Q&A
│   ├── brands/
│   │   ├── page.tsx            # Brand management
│   │   └── embed/page.tsx      # Public widget
│   ├── embed/map/              # Embeddable map
│   └── [other modules]/
├── src/
│   ├── lib/
│   │   ├── firestore.ts        # Centralized data layer
│   │   └── firebase.ts         # Firebase config
│   └── components/
│       ├── ProtectedRoute.tsx  # Admin guard
│       ├── UserProtectedRoute.tsx # User guard
│       └── OwnerRoute.tsx      # Owner guard
└── public/
    ├── manifest.json           # PWA config
    └── sw.js                   # Service Worker
```

## 🚀 Installation

### Prerequisites
- Node.js 18+
- Firebase account
- Environment variables configured

### Steps
```bash
# Clone repository
git clone https://github.com/madgIitch/Dirty-Roots.git
cd Dirty-Roots/pwa

# Install dependencies
npm install

# Configure Firebase
# Copy .env.example to .env.local
# Add Firebase credentials

# Run development
npm run dev

# Production build
npm run build
npm start
```

## 🎯 Main Features

### 1. Admin Console (`/`)
Centralized panel with access to: [1-cite-2](#1-cite-2) 
- 🗺️ **Places**: Calm places management
- 🛠️ **Community Admin**: Content moderation
- 🎙️ **Live Sessions**: Live sessions
- 🛍️ **Shop**: Product management
- 🌿 **Seasonal Toolkit**: Seasonal guides
- 🏷️ **Brands**: Partner brands
- 🎁 **Discount Tiers**: Discount levels
- 👥 **Admins Console**: Administrator management

### 2. Plant Community (`/community/herbarium`)
Social network for sharing plant photos with: [1-cite-3](#1-cite-3) 
- 13 thematic categories (New Leaf, Comeback Story, etc.)
- Like and comment system
- User profiles with progress
- Invitation and reward system

### 3. Embeddable Widgets
Public components for external integration: [1-cite-4](#1-cite-4) 
- `/brands/embed` - Brand carousel
- `/embed/map` - Places map
- `/live/embed` - Live sessions
- Automatic anonymous authentication

### 4. PWA Configuration
Installable application with: [1-cite-5](#1-cite-5) 
- Standalone mode
- Portrait orientation
- Service Worker for offline
- 512x512 icons
- Direct shortcuts to Herbarium

## 🔧 Firebase Configuration

### Main Collections
The centralized data layer manages 13+ collections: [1-cite-6](#1-cite-6) 

| Collection | Use | Key Functions |
|-----------|-----|---------------|
| `places` | Calm places | `addPlace()`, `listPlacesNear()` |
| `plantPhotos` | Community gallery | `addPlantPhoto()`, `addLikeToPhoto()` |
| `userProfiles` | User profiles | `createUserProfile()`, `updateUserProfile()` |
| `brands` | Partner brands | `addBrand()`, `listBrands()` |
| `liveSessions` | Live sessions | `addLiveSession()`, `addSeatReservation()` |
| `discountTiers` | Discount levels | `addDiscountTier()`, `checkDiscountEligibility()` |

### Security Rules
Security rules implement:
- Public reading for specific collections
- Writing only for authenticated users
- Role validation for admin operations
- User profile protection

## 📱 Deployment

### Web PWA
```bash
npm run build
npm start
```

### Desktop Apps (Electron)
```bash
npm run electron-build
# Generates:
# - Windows: NSIS installer
# - macOS: DMG
# - Linux: AppImage
```

### Environment Variables
```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## 🎨 Theme and Styles

- **Background**: `#0B0B0B` (dark)
- **Primary**: `#A4CB3E` (lime green)
- **Accent**: `#FF60A8` (pink)
- **Text**: `#F5F5F5` (white)
- **Secondary**: `#B6B9BF` (gray)

## 🔄 Authentication Flow

### Admin Login
1. Navigate to `/auth`
2. Enter email/password
3. Verify `!user.isAnonymous` [1-cite-7](#1-cite-7) 
4. Redirect to `/`

### User Registration
1. Navigate to `/user-auth`
2. Complete form (optional invite code) [1-cite-8](#1-cite-8) 
3. Create Firebase account
4. Process invitation if applicable
5. Redirect to `/community/herbarium`

## 📊 Invitation System

Viral mechanism with: [1-cite-9](#1-cite-9) 
- Unique link generation
- Server-side processing via `/api/invitations/process`
- Automatic inviter progress updates
- Progressive discount system

## 🛠️ Available Scripts

| Script | Command | Purpose |
|--------|---------|-----------|
| `dev` | `next dev` | Development server |
| `build` | `next build` | Production build |
| `start` | `next start` | Production server |
| `electron-dev` | `electron .` | Electron development |
| `electron-build` | Multi-step | Build desktop apps |

## 📝 Important Notes

- Project uses **TypeScript** for type safety
- **Image compression** automatic for uploads
- **Geohashing** for efficient spatial searches
- **Soft deletion** instead of hard delete
- **Server timestamps** for consistency

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Descriptive commits
4. Pull request with detailed description

---

**Dirty Roots** - Building community around plants and tranquility 🌿

## Notes
This README covers the main architecture of the Dirty Roots project. For specific implementation details, consult individual files and wiki documentation. The project is designed as a modular platform with multiple entry points (web, PWA, desktop, widgets). [1-cite-10](#1-cite-10) 

Wiki pages you might want to explore:
- [Overview (madgIitch/Dirty-Roots)](/wiki/madgIitch/Dirty-Roots#1)
- [Invitation and Referral System (madgIitch/Dirty-Roots)](/wiki/madgIitch/Dirty-Roots#3.5)

### Citations

**File:** pwa/public/manifest.json (L2-5)
```json
  "name": "Dirty Roots - RootShare",  
  "short_name": "Dirty Roots",   
  "description": "Find other calmness addicts like you, upload and share your plants, and gain knowledge from others through the forum",  
  "start_url": "/community/herbarium",  
```

**File:** pwa/public/manifest.json (L6-10)
```json
  "display": "standalone",  
  "background_color": "#0B0B0B",  
  "theme_color": "#A4CB3E",  
  "orientation": "portrait-primary",  
  "scope": "/community/",  
```

**File:** pwa/app/community/herbarium/page.tsx (L16-30)
```typescript
const CATEGORIES = {      
  'new-leaf': { label: 'New Leaf Incoming 🌱', emoji: '🌱' },      
  'fresh-sprout': { label: 'Fresh Sprout 🌿', emoji: '🌿' },      
  'comeback-story': { label: 'Comeback Story ✨', emoji: '✨' },      
  'not-doing-great': { label: 'Not Doing Great 😵‍💫', emoji: '😵‍💫' },      
  'droopy-day': { label: 'Droopy Day 😔', emoji: '😔' },      
  'overwatered': { label: 'Overwatered Moments 💧', emoji: '💧' },      
  'repotting': { label: 'Repotting Time 🪴', emoji: '🪴' },      
  'pest-patrol': { label: 'Pest Patrol 🐛', emoji: '🐛' },      
  'plant-glow-up': { label: 'Plant Glow-Up ✨🌿', emoji: '✨🌿' },      
  'caught-in-4k': { label: 'Caught in 4K 📸', emoji: '📸' },      
  'accidental-jungle': { label: 'Accidental Jungle 🌴😂', emoji: '🌴😂' },      
  'back-from-vacation': { label: 'Back From Vacation 🧳🌱', emoji: '🧳🌱' },      
  'plant-funeral': { label: 'Plant Funeral ⚰️🪦', emoji: '⚰️🪦' }      
} as const;    
```

**File:** pwa/src/lib/firestore.ts (L62-77)
```typescript
export type Place = {  
  id?: string;  
  name: string;  
  city: string;  
  placeType?: "park" | "cafe";  
  address?: string;  
  schedule?: string;  
  description?: string;  
  photo?: string | null;  
  coords: { lat: number; lng: number };  
  geohash: string;  
  tags?: string[];  
  createdBy: string;  
  createdAt: Timestamp;  
  status?: "approved" | "pending";  
};  
```

**File:** pwa/app/user-auth/page.tsx (L27-39)
```typescript
  useEffect(() => {  
    // Capturar código de invitación de la URL  
    const urlParams = new URLSearchParams(window.location.search);  
    const code = urlParams.get('invite');  
    console.log('🔍 [INVITATION] Checking URL for invite code...', { url: window.location.search, code });  
        
    if (code) {  
      console.log('✉️ [INVITATION] Invite code found:', code);  
      setInviteCode(code);  
    } else {  
      console.log('❌ [INVITATION] No invite code in URL');  
    }  
  }, []);  
```

**File:** pwa/app/user-auth/page.tsx (L65-95)
```typescript
        // Si hay código de invitación, procesarlo  
        if (inviteCode) {  
          console.log('🎯 [INVITATION] Processing invitation registration...', {     
            inviteCode,     
            registeredUid: result.user.uid     
          });  
              
          try {  
            const response = await fetch('/api/invitations/process', {  
              method: 'POST',  
              headers: {  
                'Content-Type': 'application/json',  
              },  
              body: JSON.stringify({  
                inviteCode,  
                registeredUid: result.user.uid,  
              }),  
            });  
                
            if (!response.ok) {  
              throw new Error('Error procesando invitación');  
            }  
              
            console.log('✅ [INVITATION] Invitation processed successfully');  
          } catch (inviteError) {  
            console.error('❌ [INVITATION] Failed to process invitation:', inviteError);  
            throw inviteError;  
          }  
        } else {  
          console.log('ℹ️ [INVITATION] No invitation code to process');  
        }  
```
