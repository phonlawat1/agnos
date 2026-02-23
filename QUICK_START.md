# Quick Reference Guide

## 🚀 Getting Started (5 Minutes)

### For Windows Users

Double-click `start.bat` - it will automatically start both server and frontend

### For Mac/Linux Users

```bash
npm run dev:all
```

### Manual Setup

```bash
# Terminal 1
npm run server

# Terminal 2
npm run dev
```

## 📱 Testing the App

### Window 1: Patient Form

Open browser: http://localhost:3000/patient

### Window 2: Staff Dashboard

Open browser: http://localhost:3000/staff

### Test Real-Time Sync

1. In **Patient Form** - Start typing in any field

   - See "Typing..." indicator appear in **Staff Dashboard**

2. In **Patient Form** - Complete and submit the form

   - New patient card appears instantly in **Staff Dashboard**

3. Fill multiple patient forms simultaneously
   - Watch all updates happen in real-time

## 🛠️ File Structure Cheat Sheet

```
/src/app/patient/page.tsx          ← Patient form page
/src/app/staff/page.tsx            ← Staff dashboard page
/src/components/form/PatientForm   ← Form with 13 fields
/src/lib/socket.ts                 ← Socket.io client config
/src/hooks/useSocket.ts            ← React hook for socket
/server.js                          ← Socket.io backend server
```

## 🔧 Common Commands

| Command           | What it does                 |
| ----------------- | ---------------------------- |
| `npm run dev:all` | Start both server + frontend |
| `npm run server`  | Start Socket.io server only  |
| `npm run dev`     | Start Next.js frontend only  |
| `npm run build`   | Create production build      |
| `npm run lint`    | Check code quality           |

## 📊 Socket.io Events Reference

### Typing Events

```javascript
// Patient starts typing
emit("patient-typing", { patientId: "xxx" });

// Patient stops typing (sent after 2 seconds of inactivity)
emit("patient-stopped-typing", { patientId: "xxx" });
```

### Submission Events

```javascript
// Patient submits form
emit("patient-submit", patientDataObject);

// Broadcasted to staff dashboard
on("patient-submitted", patientDataObject);
```

## 🐛 Quick Troubleshooting

### Services won't connect

1. Make sure both are running (`npm run dev:all`)
2. Check `.env.local` has `NEXT_PUBLIC_SOCKET_URL=http://localhost:3001`
3. Restart services

### Port 3000 or 3001 already in use

```bash
# Find what's using the port
netstat -ano | findstr :3001

# Kill the process (replace PID with the process ID)
taskkill /PID <PID> /F
```

### Build errors

```bash
rm -rf .next
npm run build
```

## 📧 Form Fields

**Required:**

- First Name, Last Name
- Email (must be valid)
- Phone (international format)
- Date of Birth (must be past date)
- Gender
- Address (min 5 chars)
- Preferred Language
- Nationality

**Optional:**

- Middle Name
- Religion
- Emergency Contact Name
- Emergency Contact Relationship

## 🎨 UI Components

### PatientForm.tsx

- Organized into 4 sections
- Real-time validation feedback
- Auto-emits typing events
- Success message on submit

### PatientLiveCard.tsx

- Shows all patient fields
- "Typing..." animated indicator
- Color-coded design
- Emergency contact section

## 📱 Responsive Breakpoints

- **Mobile:** < 640px (1 column, 100% width)
- **Tablet:** 640-1023px (2 columns)
- **Desktop:** > 1024px (3 columns)

## 🔐 Security Notes

- Form validation via Zod schemas
- CORS enabled for localhost
- Automatic socket cleanup on disconnect
- Rate limiting via typing debounce

## 📝 Environment Variables

```properties
# Frontend needs to connect to Socket.io server
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# Backend server config
PORT=3001
CLIENT_URL=http://localhost:3000
```

## 🌐 Deployment Checklist

- [ ] Update `NEXT_PUBLIC_SOCKET_URL` to production URL
- [ ] Deploy frontend to Vercel
- [ ] Deploy `server.js` to Railway/Render/Heroku
- [ ] Update CORS origins in `server.js`
- [ ] Test real-time sync on production

## 📊 Performance Tips

- Typing debounce: 2 seconds (prevents spam)
- Stale connection cleanup: Every 2 seconds
- Max reconnection attempts: 5
- Fallback: WebSocket → Polling

## 🎓 Learn More

- [Detailed Socket.io Setup](./SOCKET_SETUP.md)
- [Full README](./README.md)
- [Next.js Docs](https://nextjs.org/docs)
- [Socket.io Docs](https://socket.io/docs/)

## 💡 Tips

1. **Multiple browsers:** Test with 3+ browser windows simultaneously
2. **Network tab:** Use DevTools to see Socket.io connections
3. **Console logs:** All socket events are logged for debugging
4. **Live reload:** Both frontend and server auto-restart on file changes
5. **Testing:** Use browser DevTools → Application → Cookies to see session data
