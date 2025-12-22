# Fagerstrom Test Retake Feature - Implementation Summary

## Overview
This implementation allows users to retake the Fagerstrom test from the dashboard, stores multiple test sessions with scores, and displays historical test results.

## Changes Made

### 1. Database Changes

#### New Migration File
- **File**: `server/migrations/007_update_fagerstrom_for_multiple_sessions.sql`
- **Changes**:
  - Created `fagerstrom_sessions` table to store test sessions with scores
  - Added `session_ref` column to `fagerstrom_user_answers` to link answers to sessions
  - Removed unique constraint on `(user_id, question_id)` to allow multiple test sessions
  - Added unique constraint on `(session_ref, question_id)` to prevent duplicate answers in same session
  - Migrated existing data to use the new session structure
  - Added indexes for better query performance

#### Table Structure
```sql
fagerstrom_sessions:
- id (UUID, primary key)
- user_id (UUID, foreign key to users)
- score (INT, 0-10)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

fagerstrom_user_answers (updated):
- id (existing)
- user_id (existing)
- question_id (existing)
- answer_text (existing)
- session_ref (NEW - UUID, foreign key to fagerstrom_sessions)
- created_at (existing)
- updated_at (existing)
```

### 2. Backend Changes

#### Service Layer (`server/src/services/fagerstromService.js`)
- **Updated `getFagerstromUserAnswers()`**: Now accepts optional `sessionId` parameter to fetch answers from specific session or latest session
- **Updated `saveFagerstromAnswers()`**: 
  - Creates a new session for each test
  - Calculates Fagerstrom score based on standard scoring rules
  - Returns score and sessionId
- **Added `calculateAnswerScore()`**: Helper function to calculate score for each answer
- **Added `getFagerstromSessionHistory()`**: Retrieves all test sessions for a user
- **Added `getLatestFagerstromSession()`**: Gets the most recent test session

#### Controller Layer (`server/src/controllers/fagerstromController.js`)
- **Updated `getFagerstromUserAnswers()`**: Supports optional sessionId query parameter
- **Updated `saveFagerstromAnswers()`**: Returns score and sessionId in response
- **Added `getFagerstromSessionHistory()`**: Endpoint to get all sessions
- **Added `getLatestFagerstromSession()`**: Endpoint to get latest session

#### Routes (`server/src/routes/fagerstrom.js`)
- Added `GET /fagerstrom/sessions/history` - Get all test sessions
- Added `GET /fagerstrom/sessions/latest` - Get latest test session
- Updated existing routes to support new functionality

### 3. Frontend Changes

#### New Components

**`client/src/components/features/fagerstrom/FagerstromTest.tsx`**
- Reusable component for displaying and submitting Fagerstrom test
- Can be used in both onboarding and retake flows
- Props:
  - `onComplete`: Callback with score and sessionId
  - `onCancel`: Optional cancel callback
  - `showCancelButton`: Show/hide cancel button
  - `title`: Custom title
  - `description`: Custom description

#### New Pages

**`client/pages/fagerstrom-test.tsx`**
- Standalone page for retaking the test
- Navigates to results page after completion
- Includes back button to dashboard

**`client/pages/fagerstrom-results.tsx`**
- Displays test score with interpretation
- Shows score level (Very Low, Low, Medium, High, Very High)
- Color-coded based on severity
- Navigation to dashboard and history

**`client/pages/fagerstrom-history.tsx`**
- Lists all past test sessions
- Shows score, date, and dependence level for each session
- Displays progress indicators (improvement/decline)
- Highlights latest test
- Option to take test again

#### Updated Components

**`client/src/components/features/dashboard/DashboardPage.tsx`**
- Added "Retake Test" button in top right corner
- Button navigates to `/fagerstrom-test`
- Responsive design (shows "Test" on mobile, "Retake Test" on desktop)

### 4. Scoring System

The Fagerstrom Test uses standard scoring (0-10 scale):

**Question Scoring:**
1. How soon after waking do you smoke?
   - Within 5 minutes: 3 points
   - 6-30 minutes: 2 points
   - 31-60 minutes: 1 point
   - After 60 minutes: 0 points

2. Difficult to refrain in forbidden places?
   - Yes: 1 point
   - No: 0 points

3. Which cigarette would you hate most to give up?
   - First one in morning: 1 point
   - Any other: 0 points

4. How many cigarettes per day?
   - 10 or less: 0 points
   - 11-20: 1 point
   - 21-30: 2 points
   - 31 or more: 3 points

5. Smoke more in first hours after waking?
   - Yes: 1 point
   - No: 0 points

6. Smoke when ill in bed?
   - Yes: 1 point
   - No: 0 points

**Score Interpretation:**
- 0-2: Very Low dependence
- 3-4: Low dependence
- 5-6: Medium dependence
- 7: High dependence
- 8-10: Very High dependence

## API Endpoints

### New Endpoints
- `GET /api/fagerstrom/sessions/history` - Get all test sessions for user
- `GET /api/fagerstrom/sessions/latest` - Get latest test session

### Updated Endpoints
- `GET /api/fagerstrom/answers?sessionId=<uuid>` - Get answers (optionally for specific session)
- `POST /api/fagerstrom/answers` - Save answers (now returns `{ success, sessionId, score }`)

## User Flow

1. User clicks "Retake Test" button on home page (/app)
2. Navigates to `/fagerstrom-test` page
3. Answers all questions
4. Submits test
5. Backend creates new session, calculates score
6. User redirected to `/fagerstrom-results?score=X&sessionId=Y`
7. User sees score with interpretation
8. User can:
   - Return to home (/app)
   - View test history
9. From history page, user can see all past tests and take test again

## Migration Instructions

1. Run the migration:
   ```bash
   cd server
   node run-fagerstrom-migration.js
   ```

2. Restart the server:
   ```bash
   npm run dev
   ```

3. The client should automatically pick up the changes

## Testing Checklist

- [ ] Database migration runs successfully
- [ ] Existing fagerstrom answers are preserved
- [ ] New test creates a new session
- [ ] Score is calculated correctly
- [ ] Dashboard button navigates to test page
- [ ] Test page displays all questions
- [ ] Results page shows correct score and interpretation
- [ ] History page lists all past tests
- [ ] Progress indicators show improvement/decline
- [ ] All navigation works correctly

## Notes

- The scoring algorithm in `calculateAnswerScore()` should be adjusted based on your actual question IDs and answer options
- The current implementation assumes standard Fagerstrom questions
- Session data is never deleted, allowing full historical tracking
- The latest session is always used when fetching user's current answers
- Each test retake creates a completely new session

## Future Enhancements

Potential improvements:
1. Add charts/graphs to visualize progress over time
2. Export test history as PDF
3. Set reminders to retake test periodically
4. Compare scores with community averages
5. Add notes/comments to each test session
6. Email notifications when score improves significantly
