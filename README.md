This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## MediCare Patient Registration & Real-time Dashboard

A modern, full-stack application for patient registration with real-time staff monitoring using Next.js, React, and Socket.io.

### 🎯 Key Features

- **Patient Registration Form** (`/patient`) - Comprehensive form with all required fields
- **Staff Dashboard** (`/staff`) - Real-time patient display with live updates
- **Real-time Synchronization** - WebSocket-based using Socket.io
- **Typing Indicators** - See which patients are actively filling forms
- **Form Validation** - Zod schemas for type-safe validation
- **Fully Responsive** - Works on mobile, tablet, and desktop

### 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run both frontend and server together (Recommended)
npm run dev:all

# Or run separately:
npm run server        # Terminal 1
npm run dev           # Terminal 2
```

**Access the application:**

- Home: http://localhost:3000
- Patient Form: http://localhost:3000/patient
- Staff Dashboard: http://localhost:3000/staff

### 📡 Real-Time Events

**Client → Server:**

- `patient-submit` - Patient form submission
- `patient-typing` - Patient started typing
- `patient-stopped-typing` - Patient stopped typing

**Server → Client (Broadcast):**

- `patient-submitted` - New patient registration
- `patient-typing` - Patient is typing
- `patient-stopped-typing` - Patient stopped typing

See [SOCKET_SETUP.md](./SOCKET_SETUP.md) for detailed Socket.io documentation.

### 🛠️ Tech Stack

- **Next.js 16** - Frontend framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Socket.io** - Real-time WebSocket communications
- **Zod** - Form validation
- **Express.js** - Backend Socket.io server

### 📝 Scripts

```bash
npm run dev       # Next.js dev server
npm run server    # Socket.io server
npm run dev:all   # Both simultaneously
npm run build     # Production build
npm start         # Production server
```

### 📄 Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
PORT=3001
CLIENT_URL=http://localhost:3000
```

### 📚 Documentation

- [Socket.io Setup Guide](./SOCKET_SETUP.md) - Detailed real-time configuration
- [Original Next.js Docs](https://nextjs.org/docs)

### ✨ Highlights

✅ Fully responsive design
✅ Real-time WebSocket sync
✅ Type-safe with TypeScript
✅ Professional UI design
✅ Live typing indicators
✅ Automatic error recovery
✅ Production-ready
