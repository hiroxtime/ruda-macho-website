# RUDA MACHO RUGBY - PROJECT SUMMARY

## 🏉 Overview
**Full-stack web application** for Asamblea Rugby Club (Ruda Macho) — a real production project with authentication, database, and gamification.

**Role:** Full-Stack Developer (Scholarship Technical Position)  
**Client:** Asamblea Rugby Club, Buenos Aires, Argentina  
**Timeline:** March 2026 (Intensive 2-day sprint)  
**Status:** ✅ Production Ready

---

## 🌐 Live Demo
**Website:** https://rudamachorugby.netlify.app  
**GitHub:** https://github.com/hiroxtime/ruda-macho-website

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router, Static Export)
- **TypeScript** (Full type safety)
- **Tailwind CSS** (Custom design system)
- **Responsive Design** (Mobile-first approach)

### Backend & Database
- **Supabase** (PostgreSQL + Auth + Storage)
- **Row Level Security (RLS)** policies
- **Storage buckets** for avatar uploads

### Deployment
- **Netlify** (CI/CD from GitHub)
- **Environment variables** for secure API keys
- **Automatic deploys** on every push

---

## ✨ Key Features

### 1. Authentication System
- Email/password registration
- Protected routes
- Session management
- Automatic profile creation on signup

### 2. Player Profiles
- Personal information (name, phone, birth date)
- Player type: Active vs Associate
- Position selection (Pilar, Medio scrum, etc.)
- **Avatar upload** with image storage
- Seniority tracking (join date)

### 3. Ruda School (Gamification Platform)
- **6-level learning journey**
- XP system and progression
- Badges and achievements
- Lesson tracking (8/24 completed)
- "Rugby con Luca" educational content

### 4. Financial Dashboard
- Payment status tracking
- Privacy toggle ("ojito" feature)
- Monthly dues visibility
- Next due date reminders

### 5. Responsive Design
- Mobile-optimized navigation
- Floating logo animation
- Custom color palette (Ruda Green #1B5E20, Ruda Gold #FFC107)
- Loading screen with video

---

## 🎨 Design Highlights

### Visual Identity
- **Colors:** Club jersey colors (Green & Gold)
- **Logo:** Animated floating effect with glow
- **Typography:** Bold, sporty aesthetic
- **Animations:** CSS keyframes for engaging UX

### Mobile Experience
- Hamburger menu for navigation
- Sticky header with logo
- Optimized touch targets
- Fast loading on 3G/4G

---

## 🔧 Technical Challenges Solved

### 1. Static Export Configuration
**Problem:** Next.js static export with dynamic routes  
**Solution:** Configured `next.config.js` with `output: 'export'` and `distDir: 'dist'`

### 2. Supabase Integration
**Problem:** Environment variables for production  
**Solution:** Set up Netlify environment variables with proper Supabase keys

### 3. File Uploads
**Problem:** Avatar storage and database updates  
**Solution:** Supabase Storage + SQL column addition for `avatar_url`

### 4. Mobile Navigation
**Problem:** No menu on mobile devices  
**Solution:** Built custom responsive header with React state management

### 5. Type Safety
**Problem:** TypeScript errors with Supabase types  
**Solution:** Proper interface definitions and null checks

---

## 📊 Project Impact

### For the Club
- Centralized player management system
- Gamified learning platform for new players
- Digital membership tracking
- Professional online presence

### For My Portfolio
- Real client project (not a tutorial)
- Production deployment with real users
- Full-stack implementation
- Complex database relationships
- File handling and storage
- Responsive design expertise

---

## 🚀 Future Enhancements

- [ ] Admin dashboard for club managers
- [ ] Payment integration (MercadoPago)
- [ ] Team roster management
- [ ] Match scheduling
- [ ] Push notifications
- [ ] Dark/light mode toggle

---

## 📁 Project Structure

```
ruda-rugby-website/
├── app/
│   ├── components/     # Reusable UI components
│   ├── login/         # Authentication pages
│   ├── registro/      # Registration flow
│   ├── perfil/        # User profile dashboard
│   ├── ruda-school/   # Gamification platform
│   └── page.tsx       # Landing page
├── contexts/
│   └── AuthContext.tsx # Global auth state
├── lib/
│   └── supabase.ts    # Database client
├── public/
│   └── assets/        # Images, videos, logos
└── docs/              # Project documentation
```

---

## 📝 What I Learned

1. **Supabase deep dive:** Auth, Storage, RLS policies
2. **Static site generation:** Next.js export optimization
3. **CI/CD workflows:** GitHub + Netlify automation
4. **Mobile-first CSS:** Responsive design patterns
5. **Client communication:** Delivering for real stakeholders

---

**Contact:** antonycarrerah@gmail.com  
**Portfolio:** github.com/hiroxtime
