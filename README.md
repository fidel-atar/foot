# Mauritanian Football App Backend

## Overview
This is a comprehensive backend system for the Mauritanian Football App built with Supabase. It provides a complete database schema, API endpoints, and admin functionality for managing football-related content.

## Features

### Database Schema
- **Teams**: Football teams with logos, stadiums, and coach information
- **Players**: Player profiles with stats and team associations
- **Matches**: Match scheduling, results, and live updates
- **News**: News articles with featured content support
- **Shop**: E-commerce functionality with categories and products
- **Match Events**: Goals, cards, and other match events
- **Player Stats**: Seasonal statistics tracking

### API Endpoints
- RESTful API through Supabase
- Edge functions for complex queries
- Real-time subscriptions support
- File upload capabilities

### Security
- Row Level Security (RLS) enabled on all tables
- Public read access for published content
- Authenticated admin access for content management
- Secure file storage with access controls

## Database Tables

### Core Tables
1. **teams** - Team information and metadata
2. **players** - Player profiles and statistics
3. **matches** - Match scheduling and results
4. **news** - News articles and announcements
5. **shop_categories** - Product categories
6. **shop_items** - Shop products and inventory
7. **match_events** - Match events (goals, cards, etc.)
8. **player_stats** - Seasonal player statistics

### Key Features
- Automatic timestamps with triggers
- Foreign key relationships
- Optimized indexes for performance
- Data validation constraints

## Setup Instructions

### 1. Supabase Project Setup
1. Create a new Supabase project
2. Copy the project URL and anon key
3. Update the connection details in the mobile app

### 2. Database Migration
Run the migration files in order:
1. `create_football_schema.sql` - Creates all tables and security policies
2. `insert_sample_data.sql` - Adds sample data for testing

### 3. Edge Functions (Optional)
Deploy the edge functions for enhanced API capabilities:
- `get-teams` - Enhanced team queries
- `get-players` - Player queries with team information
- `get-matches` - Match queries with team details
- `get-news` - News queries with filtering
- `get-shop-items` - Shop item queries

### 4. Mobile App Configuration
Update the mobile app to use the new backend:
- The `supabaseService.js` provides all CRUD operations
- Admin screens are fully functional with real data
- All user screens display live data from Supabase

## Sample Data
The system includes comprehensive sample data:
- 8 Mauritanian football teams
- 40 players (5 per team)
- 20 matches with various statuses
- 5 news articles (3 featured)
- 5 shop categories with 15 products

## API Usage

### Reading Data (Public Access)
```javascript
// Get all teams
const teams = await supabase.from('teams').select('*')

// Get featured news
const news = await supabase
  .from('news')
  .select('*')
  .eq('is_featured', true)
  .eq('published', true)

// Get matches with team info
const matches = await supabase
  .from('matches')
  .select(`
    *,
    home_team:teams!matches_home_team_id_fkey(name, logo_url),
    away_team:teams!matches_away_team_id_fkey(name, logo_url)
  `)
```

### Writing Data (Admin Access)
```javascript
// Create a new team (requires authentication)
const { data, error } = await supabase
  .from('teams')
  .insert([{
    name: 'نادي جديد',
    city: 'نواكشوط',
    coach: 'المدرب الجديد'
  }])
```

## Security Model

### Row Level Security Policies
- **Public Read**: All published content is readable by anonymous users
- **Admin Write**: Authenticated users can create, update, and delete content
- **Data Integrity**: Foreign key constraints ensure data consistency

### Authentication
- Supabase Auth integration ready
- Admin panel accessible after authentication
- Secure API key management

## Performance Optimizations
- Strategic database indexes
- Efficient query patterns
- Edge function caching
- Optimized data relationships

## Future Enhancements
- Real-time match updates
- Push notifications
- Advanced statistics
- User comments and ratings
- Social features
- Mobile app offline support

## Support
For technical support or questions about the backend implementation, please refer to the Supabase documentation or contact the development team.