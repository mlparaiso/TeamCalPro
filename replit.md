# Team Schedule Calendar Web App

## Overview

This is a modern web application that displays team schedules in a Google Calendar-style interface. The app connects to Google Sheets as a data source to manage team member shifts and displays them in an intuitive weekly calendar format. Team members work 9-hour shifts starting from their designated login times, with support for time-off tracking and analyst-based filtering.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with JSON responses
- **Data Storage**: In-memory storage implementation with interface for extensibility
- **Database Integration**: Drizzle ORM configured for PostgreSQL (using Neon Database)
- **Development**: Hot module replacement via Vite development server

### Data Model
- **Team Members**: Name, analyst assignment, login time, and time-off days
- **Schedule Data**: Processed shift information with calculated start/end times
- **Statistics**: Aggregated metrics for team overview
- **Validation**: Zod schemas for runtime type checking and data validation

### External Dependencies
- **Google Sheets API**: Primary data source for team schedules
  - Reads from "Schedule" sheet with structured columns (Team Member, Analyst, Login Time, Time Offs)
  - Requires API key and spreadsheet ID for authentication
- **Neon Database**: PostgreSQL hosting service for production data persistence
- **Drizzle Kit**: Database migration and schema management
- **Replit Integration**: Development environment optimizations and error handling

### Key Features
- **Calendar Interface**: Google Calendar-inspired weekly view with hourly time slots (10 AM - 10 PM)
- **Analyst Filtering**: Dropdown selection to filter schedules by supervisor
- **Day Selection**: View schedules for specific days of the week
- **Shift Visualization**: Color-coded blocks showing 9-hour shifts with hover tooltips
- **Time-off Handling**: Gray-out or hide shifts for designated off days
- **Real-time Sync**: Manual Google Sheets synchronization with success/error feedback
- **Responsive Design**: Mobile and desktop optimized layouts
- **Statistics Dashboard**: Overview cards showing total members, active shifts, and time-offs

### Design Patterns
- **Component Composition**: Modular UI components with clear separation of concerns
- **Custom Hooks**: Reusable logic for mobile detection and toast notifications
- **Type Safety**: End-to-end TypeScript with shared schemas between client and server
- **Error Boundaries**: Graceful error handling with user-friendly messages
- **Loading States**: Skeleton components and loading indicators for better UX