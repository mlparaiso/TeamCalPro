# Team Schedule Calendar Web App

A modern web application that displays team schedules in a Google Calendar-style interface with Google Sheets integration and OAuth authentication.

## Features

- **Modern Calendar Layout**: Team member names in left column, time slots (10 AM - 10 PM) across the top
- **Day-of-Week Selection**: Choose specific days (Sunday to Saturday) to view schedules
- **Google OAuth Integration**: Secure sign-in with Google for direct spreadsheet access
- **Analyst Filtering**: Filter team schedules by supervisor/analyst
- **9-Hour Shift Visualization**: Color-coded blocks showing team member shifts with hover tooltips
- **Time-off Management**: Visual indication of team member time-off days
- **Real-time Statistics**: Dashboard cards showing team metrics
- **Responsive Design**: Optimized for both mobile and desktop

## Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for build tooling and development server
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **TanStack Query** for server state management
- **Wouter** for client-side routing
- **React Hook Form** with Zod validation

### Backend
- **Node.js** with Express.js
- **TypeScript** with ES modules
- **Drizzle ORM** for database operations
- **PostgreSQL** (Neon Database) for production
- **In-memory storage** for development

### External Services
- **Google Sheets API** with OAuth 2.0 authentication
- **Google Cloud Console** for API credentials

## Prerequisites

1. **Node.js** 20 or higher
2. **Google Cloud Console** project with:
   - Google Sheets API enabled
   - OAuth 2.0 client ID configured
   - API key created

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd team-schedule-calendar
npm install
```

### 2. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the **Google Sheets API**
4. Create credentials:
   - **OAuth 2.0 Client ID**: 
     - Application type: Web application
     - Add your app URL to authorized origins
   - **API Key**: 
     - Restrict to Google Sheets API

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_GOOGLE_CLIENT_ID=your_oauth_client_id_here
VITE_GOOGLE_API_KEY=your_api_key_here
```

### 4. Google Sheets Format

Create a Google Sheet with a "Schedule" tab containing these columns:

| Column A | Column B | Column C | Column D |
|----------|----------|----------|----------|
| Team Member | Analyst | Login Time | Time Offs |
| John Doe | Analyst A | 10:00 AM | Monday, Wednesday |
| Jane Smith | Analyst A | 2:00 PM | Tuesday |
| Mike Johnson | Analyst B | 6:00 AM | Friday, Saturday |

**Column Details:**
- **Team Member**: Full name of the team member
- **Analyst**: Supervisor/analyst name for filtering
- **Login Time**: Shift start time (e.g., "10:00 AM", "2:30 PM")
- **Time Offs**: Comma-separated days when the member is off

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Usage

1. **Sign in with Google**: Click the "Sign in with Google" button to authenticate
2. **Load Spreadsheet**: Enter your Google Sheets URL and click "Load Schedule Data"
3. **Filter by Analyst**: Use the dropdown to view specific analyst teams
4. **Select Day**: Choose which day of the week to display
5. **View Schedules**: See team member shifts in the calendar grid

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions and configurations
│   │   ├── pages/         # Page components
│   │   └── main.tsx       # App entry point
├── server/                # Backend Express application
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Data storage interface
│   └── vite.ts           # Vite integration
├── shared/               # Shared TypeScript schemas
│   └── schema.ts         # Zod validation schemas
└── README.md
```

## API Endpoints

- `POST /api/sync-data` - Sync team data from OAuth
- `GET /api/analysts` - Get list of analysts
- `GET /api/schedule` - Get schedule data by analyst and day
- `GET /api/statistics` - Get team statistics

## Deployment

This application is designed to work with Replit's deployment system. For other platforms:

1. Set environment variables in your hosting platform
2. Build the application: `npm run build`
3. Deploy the built files and server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues related to:
- Google Sheets API setup: Check Google Cloud Console documentation
- Authentication problems: Verify OAuth client ID and authorized origins
- Data format issues: Ensure your spreadsheet matches the required column structure