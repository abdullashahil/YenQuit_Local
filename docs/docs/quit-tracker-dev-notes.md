# Quit Tracker - Development Notes

This document explains the data mapping, business logic, and implementation details for the Quit Tracker feature.

## Architecture Overview

The Quit Tracker feature consists of:
- **Backend**: Node.js/Express API with PostgreSQL database
- **Frontend**: React/Next.js components with TypeScript
- **Database**: `daily_logs` table and `profiles.quit_date` field

## Database Schema

### daily_logs Table
```sql
CREATE TABLE daily_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    smoked BOOLEAN NOT NULL,
    cigarettes_count INTEGER NULL CHECK (cigarettes_count >= 0),
    cravings_level INTEGER NULL CHECK (cravings_level >= 1 AND cravings_level <= 10),
    mood INTEGER NULL CHECK (mood >= 1 AND mood <= 10),
    notes TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE UNIQUE INDEX idx_user_logdate ON daily_logs(user_id, log_date);
```

### profiles.quit_date Field
```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS quit_date DATE NULL;
```

## API Endpoints

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/api/quit-tracker/progress` | Get user progress metrics | Yes |
| POST | `/api/quit-tracker/log` | Create/update daily log | Yes |
| PUT | `/api/quit-tracker/log/:id` | Update specific log | Yes |
| DELETE | `/api/quit-tracker/log/:id` | Delete specific log | Yes |
| GET | `/api/quit-tracker/logs` | Get paginated logs | Yes |
| PUT | `/api/quit-tracker/quit-date` | Update quit date | Yes |

## Business Logic

### Days Smoke-Free Calculation

The `daysSmokeFree` metric is calculated as a **continuous streak**:

1. **Get user's quit date** from `profiles.quit_date`
2. **Find last lapse** (smoked=true) on or after quit date
3. **Calculate streak** from the day after last lapse to today
4. **Edge cases**:
   - No quit date → 0 days
   - No logs after quit date → days from quit date to today
   - Quit date in future → 0 days

**Algorithm:**
```javascript
const lastLapseDate = findLatestSmokedLogSince(quitDate);
const startDateForCount = lastLapseDate ? 
  new Date(lastLapseDate.getTime() + 24 * 60 * 60 * 1000) : // day after lapse
  new Date(quitDate);

if (startDateForCount <= today) {
  daysSmokeFree = Math.floor((today - startDateForCount) / (24 * 60 * 60 * 1000)) + 1;
}
```

### Success Rate Calculation

Success rate is calculated over the **last 30 days** by default:

```javascript
const successRateDays = 30;
const startDate = new Date(today.getTime() - (successRateDays - 1) * 24 * 60 * 60 * 1000);
const recentLogs = getLogsSince(startDate);

const smokeFreeDays = recentLogs.filter(log => !log.smoked).length;
const successRate = Math.round((smokeFreeDays / recentLogs.length) * 100);
```

**Note**: Only days with logged entries are counted in the calculation.

### Progress Percentage

```javascript
const progressPercentage = goalDays > 0 ? 
  Math.round((daysSmokeFree / goalDays) * 100) : 0;
```

## Frontend Data Flow

### QuitTrackerCard Component

**Data Flow:**
1. **Mount**: Fetch progress data via `quitTrackerService.getProgress()`
2. **Loading**: Show spinner while fetching
3. **Error**: Display error message with retry button
4. **No Quit Date**: Show CTA to set quit date
5. **Has Data**: Display progress metrics with real-time updates

**State Management:**
```typescript
interface ProgressData {
  quitDate: string | null;
  daysSmokeFree: number;
  totalGoal: number;
  progressPercentage: number;
  lastEntry: string | null;
  successRate: number;
  logs: any[];
}
```

**Refresh Triggers:**
- Component mount
- Log created/updated/deleted (via `onLogChange` callback)
- Manual retry on error

### DailyLogModal Component

**Features:**
- **Auto-load today's log** if exists
- **Upsert behavior** (create or update)
- **Real-time validation**
- **Loading states**
- **Error handling**

**Form Fields:**
- `log_date`: Auto-set to today
- `smoked`: Boolean (derived from cigarette count)
- `cigarettes_count`: Number (0 for smoke-free)
- `cravings_level`: 1-10 slider
- `mood`: 1-10 slider (new feature)
- `notes`: Optional text
- `quit_date`: Date picker for setting/changing quit date

**Validation Rules:**
- Craving level: 1-10 required
- Mood: 1-10 optional
- Cigarette count: non-negative integer
- Date format: YYYY-MM-DD
- Quit date: not in future

## Service Layer

### quitTrackerService (Frontend)

**Key Methods:**
```typescript
getProgress(options?: ProgressOptions): Promise<ProgressResponse>
createOrUpdateLog(logData: LogData): Promise<LogResponse>
updateLog(id: string, logData: Partial<LogData>): Promise<LogResponse>
deleteLog(id: string): Promise<LogResponse>
getLogs(options?: LogsOptions): Promise<LogsResponse>
updateQuitDate(quitDate: string | null): Promise<{ quit_date: string | null }>
```

**Error Handling:**
- Uses centralized `handleApiError` from `authErrorHandler`
- Automatic redirect to login on 401/403
- User-friendly error messages

### QuitTrackerService (Backend)

**Key Methods:**
```javascript
static async getProgress(userId, options = {})
static async createOrUpdateLog(userId, logData)
static async updateLog(userId, logId, logData)
static async deleteLog(userId, logId)
static async getLogs(userId, options = {})
static async getUserQuitDate(userId)
static async updateQuitDate(userId, quitDate)
```

**Database Operations:**
- Uses PostgreSQL connection pool
- Prepared statements for security
- Transactions where needed
- Proper error handling and logging

## UI/UX Considerations

### Loading States
- **QuitTrackerCard**: Spinner during initial load
- **DailyLogModal**: Loading button during save operations
- **Error States**: Retry buttons and user-friendly messages

### Responsive Design
- Mobile-first approach
- Touch-friendly sliders
- Adaptive layouts for different screen sizes

### Visual Feedback
- **Progress visualization**: Color-coded shield status
- **Real-time updates**: Progress bar animations
- **Confirmation messages**: Smoke-free day celebrations
- **Error indicators**: Clear error messages with actions

### Accessibility
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- High contrast colors

## Security Considerations

### Authentication
- JWT token validation on all endpoints
- User isolation (users can only access their data)
- Automatic token refresh handling

### Data Validation
- Server-side validation for all inputs
- SQL injection prevention via prepared statements
- XSS prevention via proper sanitization

### Authorization
- Role-based access control
- User ownership verification
- Proper error responses (no data leakage)

## Performance Optimizations

### Database
- Indexed queries on `(user_id, log_date)`
- Efficient pagination
- Connection pooling

### Frontend
- Lazy loading of components
- Debounced API calls where appropriate
- Optimistic updates where possible

### Caching
- Progress data cached in component state
- Avoid unnecessary re-fetches
- Efficient state updates

## Testing Strategy

### Manual Testing
- Use the provided Bruno collection
- Test all error scenarios
- Verify edge cases (future dates, invalid data)

### Automated Testing
- Unit tests for service methods
- Integration tests for API endpoints
- Component tests for UI interactions

## Deployment Notes

### Database Migration
- Run the migration file before deploying
- Test rollback procedures
- Verify indexes are created

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Token signing secret
- `CLIENT_ORIGIN`: CORS allowed origin

### Monitoring
- Track API response times
- Monitor error rates
- Log user interactions

## Future Enhancements

### Potential Features
- **Streak tracking**: Visual streak indicators
- **Achievements**: Milestone badges and rewards
- **Social features**: Anonymous progress sharing
- **Analytics**: Detailed progress insights
- **Reminders**: Daily logging notifications
- **Export**: CSV/PDF progress reports

### Technical Improvements
- **Real-time updates**: WebSocket integration
- **Offline support**: Service worker caching
- **Mobile app**: React Native version
- **Advanced analytics**: Machine learning insights

## Troubleshooting

### Common Issues

**Progress not updating:**
- Check if quit date is set
- Verify logs exist for the date range
- Confirm `smoked` field is correctly set

**API errors:**
- Verify JWT token is valid
- Check network connectivity
- Review server logs for details

**UI not responsive:**
- Check CSS media queries
- Verify mobile viewport settings
- Test on actual devices

### Debug Commands

```bash
# Check database tables
psql -d your_db -c "\d daily_logs"
psql -d your_db -c "\d profiles"

# Test API directly
curl -X GET "http://localhost:5000/api/quit-tracker/progress" \
  -H "Authorization: Bearer <token>"

# Check server logs
tail -f server/logs/app.log
```

This documentation should help with understanding the implementation and troubleshooting any issues that arise during development or maintenance.
