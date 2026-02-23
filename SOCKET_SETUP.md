# Socket.io Real-Time Server Setup

This document explains how to set up and run the Socket.io server for real-time patient data synchronization.

## Architecture

```
┌─────────────────────────────────────────┐
│    Next.js Frontend (Port 3000)         │
│  ├─ /patient - Patient Form             │
│  └─ /staff - Real-time Dashboard        │
└────────────────┬────────────────────────┘
                 │ WebSocket
                 ▼
┌─────────────────────────────────────────┐
│  Node.js Socket.io Server (Port 3001)   │
│  ├─ Event: patient-submit               │
│  ├─ Event: patient-typing               │
│  ├─ Event: patient-stopped-typing       │
│  └─ Broadcast to all connected clients  │
└─────────────────────────────────────────┘
```

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Copy `.env.example` to `.env.local` and update if needed:
   ```bash
   NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
   PORT=3001
   CLIENT_URL=http://localhost:3000
   ```

### Running the Application

#### Option 1: Run Both Frontend and Server Together (Recommended)

```bash
npm run dev:all
```

This runs:

- Next.js frontend on `http://localhost:3000`
- Socket.io server on `http://localhost:3001`

#### Option 2: Run Separately

**Terminal 1 - Socket.io Server:**

```bash
npm run server
```

**Terminal 2 - Next.js Frontend:**

```bash
npm run dev
```

## Server Features

### Real-Time Events

#### 1. **Patient Submission**

When a patient completes the registration form:

```
Client: patient-submit → Server
Server: patient-submitted → All Staff Clients
```

#### 2. **Typing Indicator**

When a patient starts typing in the form:

```
Client: patient-typing → Server
Server: patient-typing → All Staff Clients
  - Shows animated "Typing..." indicator
  - Auto-clears after 2 seconds of inactivity
```

When typing stops:

```
Client: patient-stopped-typing → Server
Server: patient-stopped-typing → All Staff Clients
  - Hides typing indicator
```

### Event Flow Diagram

```
PATIENT FORM                          STAFF DASHBOARD
┌─────────────────┐                 ┌──────────────────┐
│ User types      │  ─typing───→    │ Shows indicator  │
│ form fields     │                 │ "Patient typing" │
└─────────────────┘                 └──────────────────┘

┌─────────────────┐                 ┌──────────────────┐
│ Clicks Submit   │  ─submit───→    │ New card appears │
│ Sends data      │                 │ Real-time update │
└─────────────────┘                 └──────────────────┘
```

## Server API

### Events Emitted by Clients

#### `patient-submit`

**Sent by:** Patient form on submission
**Payload:**

```typescript
{
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  preferredLanguage: string;
  nationality: string;
  religion?: string;
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  timestamp: Date;
}
```

#### `patient-typing`

**Sent by:** Patient form when user starts typing
**Payload:**

```typescript
{
  patientId: string; // Unique ID for this session
}
```

#### `patient-stopped-typing`

**Sent by:** Patient form when typing stops
**Payload:**

```typescript
{
  patientId: string;
}
```

### Events Broadcasted by Server

#### `patient-submitted`

**Sent to:** All connected clients (especially staff)
**Payload:** Complete patient data with timestamp

#### `patient-typing`

**Sent to:** All connected clients
**Payload:**

```typescript
{
  patientId: string;
}
```

#### `patient-stopped-typing`

**Sent to:** All connected clients
**Payload:**

```typescript
{
  patientId: string;
}
```

## Troubleshooting

### Connection Issues

**Problem:** Socket.io client can't connect to server

```
Error: Cannot reach http://localhost:3001
```

**Solution:**

1. Ensure Socket.io server is running: `npm run server`
2. Check `NEXT_PUBLIC_SOCKET_URL` in `.env.local`
3. Verify port 3001 is not in use: `netstat -ano | findstr :3001`

### Typing Indicator Not Working

**Problem:** Typing indicator doesn't show on staff dashboard

**Solution:**

1. Check browser console for connection errors
2. Verify both frontend and server are running
3. Clear browser cache and reload

### Events Not Received

**Problem:** Patient submissions don't appear on staff dashboard

**Solution:**

1. Open browser DevTools (F12)
2. Check Network tab for WebSocket connections
3. Monitor console for socket events
4. Ensure both windows have the Socket.io server URL configured

## Development

### Monitoring Socket.io Events

The server logs all events to console:

```
✓ User connected: abc123def456
📝 Patient submitted: 1708615832905-xyz789
⌨️  Patient typing: 1708615832905-xyz789
✋ Patient stopped typing: 1708615832905-xyz789
✗ User disconnected: abc123def456
```

### Server Files

- **`server.js`** - Main Socket.io server

  - Connection handling
  - Event routing
  - Typing state management
  - Automatic cleanup of stale typing indicators

- **`src/lib/socket.ts`** - Client Socket.io configuration

  - Connection initialization
  - Reconnection settings
  - Event debugging

- **`src/hooks/useSocket.ts`** - React hook for Socket.io
  - Socket lifecycle management
  - Initialization and cleanup

### Adding New Events

To add new real-time events:

1. **Server (`server.js`):**

   ```javascript
   socket.on("new-event", (data) => {
     console.log("New event:", data);
     io.emit("event-response", processedData);
   });
   ```

2. **Client (`src/hooks/useSocket.ts`):**
   ```typescript
   useEffect(() => {
     if (!socket) return;

     socket.on("event-response", (data) => {
       // Handle event
     });

     return () => socket.off("event-response");
   }, [socket]);
   ```

## Performance Optimization

### Connection Pooling

- Server uses efficient WebSocket transport
- Fallback to polling if WebSocket unavailable
- Automatic reconnection with exponential backoff

### Memory Management

- Stale typing indicators auto-cleared every 2 seconds
- No memory leaks from event listeners
- Proper cleanup on disconnect

## Deployment

### Production Configuration

**Environment Variables:**

```bash
NEXT_PUBLIC_SOCKET_URL=https://your-socket-server.com
PORT=3001
CLIENT_URL=https://your-app.com
NODE_ENV=production
```

**Docker Setup (Optional):**

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install --production
EXPOSE 3001
CMD ["npm", "run", "server"]
```

### Hosting Options

1. **Vercel** (Frontend only - use external Socket.io)
2. **Heroku** (Full stack)
3. **AWS EC2** (Full stack)
4. **Railway** (Full stack)
5. **Render** (Full stack)

For production, host the Socket.io server separately from the Next.js frontend.

## Testing

### Manual Testing

1. Open two browser windows

   - Window A: `http://localhost:3000/patient` (Patient form)
   - Window B: `http://localhost:3000/staff` (Staff dashboard)

2. Fill and submit form in Window A
3. Observe real-time update in Window B

4. In Window A, start typing in form fields
5. Observe "Typing..." indicator in Window B

### Console Logging

Enable socket event logging in browser console:

```javascript
// In browser console
localStorage.debug = "socket.io-client:*";
// Then reload
```

## Security Considerations

### CORS Configuration

- Server only accepts connections from configured CLIENT_URL
- Update `server.js` CORS settings for production

### Event Validation

- Server should validate all incoming data
- Consider adding authentication for production

### Rate Limiting

- Consider adding rate limiting for typing events
- Prevent spam submissions

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review server console logs
3. Check browser DevTools Network and Console tabs
4. Verify `.env.local` configuration
