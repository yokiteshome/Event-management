# 🎉 EventHub - Event Management Platform

A modern, full-stack event management system built with Next.js, MongoDB, and Tailwind CSS.

## 🌟 Features

- **Admin Dashboard**: Approve/reject event hosting companies
- **Owner Dashboard**: Create and manage events, approve attendees
- **Attendee Registration**: Public event registration forms
- **QR Code System**: Frontend-generated QR codes for event check-in
- **Responsive Design**: Beautiful UI with dark mode support

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository** (if applicable)

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Create a `.env.local` file in the root directory:
   ```bash
   MONGODB_URI=mongodb://localhost:27017/event_management
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Default Admin Credentials

- **Email:** admin@eventplatform.com
- **Password:** admin123

## 📋 User Flows

### Admin Flow
1. Login with admin credentials
2. Navigate to Admin Dashboard
3. View pending event owner registrations
4. Approve or reject event owners

### Event Owner Flow
1. Register a new company account
2. Wait for admin approval
3. Login after approval
4. Create events (name, date, location, capacity)
5. Manage attendee registrations
6. Approve/reject attendees

### Attendee Flow
1. Visit event registration page: `/events/[eventId]/register`
2. Fill in name and email
3. Submit registration
4. Wait for owner approval
5. View QR code at `/qr/[attendeeId]`
6. Present QR code at event entrance

## 🏗️ Project Structure

```
src/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── admin/           # Admin endpoints
│   │   ├── events/          # Event endpoints
│   │   └── attendees/       # Attendee endpoints
│   ├── auth/                # Auth pages (login, register)
│   ├── admin/               # Admin dashboard
│   ├── dashboard/           # Owner dashboard
│   ├── events/              # Public event pages
│   └── qr/                  # QR code pages
├── components/              # Reusable components
│   ├── ui/                  # UI primitives
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── QRBox.tsx
│   └── QRScanner.tsx
└── lib/                     # Utilities
    ├── db/                  # Database connection
    ├── models/              # Mongoose models
    ├── auth.ts              # JWT utilities
    └── validations.ts       # Zod schemas
```

## 🛠️ Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- **Backend:** Next.js API Routes
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT with bcryptjs
- **QR Codes:** qrcode.react, html5-qrcode
- **Validation:** Zod

## 📦 Key Dependencies

- `next` - React framework
- `react` & `react-dom` - UI library
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT handling
- `bcryptjs` - Password hashing
- `zod` - Schema validation
- `qrcode.react` - QR code generation
- `html5-qrcode` - QR code scanning
- `lucide-react` - Icons
- `tailwindcss` - Styling

## 🎨 Design Features

- Modern gradient backgrounds
- Smooth animations and transitions
- Responsive design (mobile, tablet, desktop)
- Dark mode support
- Custom Inter font
- Glassmorphism effects
- Hover states and micro-interactions

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - Login (admin or owner)
- `POST /api/auth/register-owner` - Register event owner
- `POST /api/auth/logout` - Logout

### Admin (Protected)
- `GET /api/admin/owners` - List all owners
- `PATCH /api/admin/owners` - Update owner status

### Events
- `POST /api/events/create` - Create event (owner only)
- `GET /api/events/list` - List owner's events
- `GET /api/events/[eventId]` - Get single event

### Attendees
- `POST /api/attendees/register` - Register for event (public)
- `PATCH /api/attendees/approve` - Approve/reject attendee (owner)
- `GET /api/attendees/list?eventId=[id]` - List event attendees (owner)
- `GET /api/attendees/details?id=[attendeeId]` - Get attendee details

## 🔒 Security Notes

**Version 1 Limitations:**
- QR codes are validated on the frontend only
- Admin credentials are hardcoded (for demo purposes)
- No email/SMS notifications
- Basic security implementation

**For Production:**
- Move admin credentials to secure storage
- Implement proper QR validation with backend
- Add rate limiting
- Enable HTTPS
- Use environment-specific secrets
- Add email verification
- Implement 2FA for admins

## 🚧 Future Enhancements (Version 2)

- Email/SMS notifications
- Backend QR validation
- Real-time check-in dashboard
- Event analytics
- Multi-tenant support
- Payment integration
- Mobile app
- Advanced security features

## 📄 License

This project is created for educational purposes.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Built with ❤️ using Next.js and modern web technologies**
