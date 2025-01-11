# ChatGenius Code Structure Documentation

## Overview
ChatGenius is a real-time chat application built with Next.js, Supabase, and shadcn/ui components. The application follows a modern architecture with server and client components, real-time subscriptions, and a robust database schema.

## Directory Structure

### 🗂️ App Directory
- `app/`
  - `(auth)/` - Authentication related pages
    - `login/page.tsx` - Login and signup page with email/password authentication [Client Component]
  - `(chat)/` - Main chat application pages
    - `chat/page.tsx` - Main chat interface [Client Component]
    - `chat/[channelId]/` - Dynamic channel pages
      - `page.tsx` - Individual channel view [Server Component]
      - `chat-messages.tsx` - Real-time message display component [Client Component]
      - `chat-input.tsx` - Message input component [Client Component]
  - `context/` - React Context providers
    - `channel-context.tsx` - Manages selected channel state [Client Component]

### 🧩 Components
- `components/`
  - `chat/` - Chat-specific components
    - `sidebar.tsx` - Channel list and workspace navigation [Client Component]
  - `ui/` - Reusable UI components (shadcn/ui) [All Client Components]
    - `button.tsx` - Button component
    - `input.tsx` - Input component
    - `card.tsx` - Card container component
    - `dialog.tsx` - Modal dialog component
    - `drawer.tsx` - Slide-out drawer component
    - `command.tsx` - Command palette component
    - `table.tsx` - Data table component
  - `theme-toggle.tsx` - Dark/light mode switcher [Client Component]

### 📚 Library
- `lib/`
  - `supabase/`
    - `client.ts` - Supabase client configuration [Client-side]
    - `server.ts` - Server-side Supabase client [Server-side]
    - `db.ts` - Database helper functions [Server-side]
  - `utils.ts` - Utility functions [Shared]
  - `hoc/`
    - `withForwardRef.tsx` - HOC for forwarding refs [Client-side]

### 🗄️ Database
- `supabase/migrations/`
  - `consolidated_initial_schema.sql` - Main database schema [Server-side]
    - Tables: workspaces, channels, channel_members, messages, profiles
    - RLS policies and triggers

### 📝 Types
- `types/`
  - `index.ts` - Core type definitions [Shared]
    - Message, Channel, Profile interfaces
  - `components.ts` - Component prop types [Shared]
    - BaseComponentProps, WithAsChildProps, WithInsetProps

### ⚙️ Configuration
- `middleware.ts` - Next.js middleware for auth and routing [Server-side]
- `components.json` - shadcn/ui configuration [Build-time]
- `tailwind.config.ts` - Tailwind CSS configuration [Build-time]

## Key Features

### Authentication
- Email/password authentication via Supabase Auth [Client-side with Server Validation]
- Protected routes with middleware [Server-side]
- User profile management [Client-side with Server Storage]

### Real-time Communication
- WebSocket-based real-time messages [Client-side]
- Channel-based communication [Client-side with Server Storage]
- Workspace organization [Client-side with Server Storage]
- Direct messaging support [Client-side with Server Storage]

### UI/UX
- Responsive design [Client-side]
- Dark/light mode support [Client-side]
- Modern component library [Client-side]
- Accessible UI elements [Client-side]

### Database
- Structured schema with relationships [Server-side]
- Row Level Security (RLS) [Server-side]
- Real-time subscriptions [Client-side]
- Profile management [Server-side]

## Technical Implementation

### Server Components
- Initial data fetching [Server-side]
- SEO optimization [Server-side]
- Protected routes [Server-side]

### Client Components
- Real-time subscriptions [Client-side]
- Interactive UI elements [Client-side]
- Form handling [Client-side]

### State Management
- React Context for global state [Client-side]
- Local state for component-specific data [Client-side]
- Real-time sync with Supabase [Client-side]

### Security
- Row Level Security (RLS) [Server-side]
- Protected API routes [Server-side]
- Secure authentication flow [Server-side]
- Cookie-based session management [Server-side]

## Development Patterns

### Component Structure
- Separation of concerns
- Reusable UI components [Client-side]
- Type-safe props [Shared]
- Forward ref pattern [Client-side]

### Data Flow
- Server-side data fetching [Server-side]
- Real-time subscriptions [Client-side]
- Optimistic updates [Client-side]
- Error handling [Both Client and Server]

### Styling
- Tailwind CSS [Client-side]
- CSS variables for theming [Client-side]
- Responsive design [Client-side]
- Consistent UI components [Client-side]