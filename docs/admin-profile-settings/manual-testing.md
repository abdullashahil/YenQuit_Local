# Admin Profile Settings - Manual Testing Guide

This document provides step-by-step instructions for manually testing the Admin Profile Settings functionality.

## Prerequisites

### Environment Setup
1. **Server Running:** Ensure the backend server is running on `http://localhost:5000`
2. **Database:** PostgreSQL database should be connected and have admin user
3. **Frontend:** React development server running on `http://localhost:3000`
4. **Admin Account:** Have valid admin credentials for testing

### Test Data Preparation
```sql
-- Create test admin user (if not exists)
INSERT INTO users (id, email, password, role, status, created_at, updated_at)
VALUES (
  'test-admin-123',
  'admin@test.com',
  '$2b$10$hashedpasswordhere', -- bcrypt hash of "Admin123!"
  'admin',
  'active',
  NOW(),
  NOW()
);

-- Create corresponding profile
INSERT INTO profiles (user_id, full_name, created_at, updated_at)
VALUES ('test-admin-123', 'Test Admin', NOW(), NOW());
```

## Test Case 1: Profile Data Loading

### Steps
1. **Login to Admin Panel**
   - Navigate to `http://localhost:3000/admin/login`
   - Enter credentials: `admin@test.com` / `Admin123!`
   - Click "Login"

2. **Navigate to Profile Settings**
   - From admin dashboard, find "Profile Settings" or navigate to `/admin/settings/profile`
   - Verify page loads without errors

3. **Verify Profile Data**
   - Check that name field is populated with "Test Admin"
   - Check that email field is populated with "admin@test.com"
   - Verify no error messages are displayed
   - Check browser console for any errors

### Expected Results
- ✅ Page loads successfully
- ✅ Profile data is displayed correctly
- ✅ No error messages shown
- ✅ No console errors

### Test Data Verification
```bash
# Check API response directly
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:5000/api/users/admin/profile
```

## Test Case 2: Profile Update - Name Only

### Steps
1. **Navigate to Profile Settings** (if not already there)
2. **Update Name Field**
   - Clear the name field
   - Enter "Updated Test Admin"
   - Leave email field unchanged
   - Leave all password fields empty
3. **Click "Save Changes" button**
4. **Verify Results**
   - Check for success message: "Profile updated successfully!"
   - Verify name field now shows "Updated Test Admin"
   - Verify email field still shows "admin@test.com"
   - Refresh page and confirm data persists

### Expected Results
- ✅ Success message appears
- ✅ Name is updated in UI
- ✅ Email remains unchanged
- ✅ Data persists after refresh
- ✅ No error messages

### Backend Verification
```sql
-- Check database for updated name
SELECT u.email, p.full_name, u.updated_at 
FROM users u 
LEFT JOIN profiles p ON u.id = p.user_id 
WHERE u.email = 'admin@test.com';
```

## Test Case 3: Profile Update - Email Only

### Steps
1. **Navigate to Profile Settings**
2. **Update Email Field**
   - Clear the email field
   - Enter "updated.admin@test.com"
   - Leave name field as "Updated Test Admin"
   - Leave all password fields empty
3. **Click "Save Changes" button**
4. **Verify Results**
   - Check for success message
   - Verify email field now shows "updated.admin@test.com"
   - Verify name field still shows "Updated Test Admin"
   - Refresh page and confirm data persists

### Expected Results
- ✅ Success message appears
- ✅ Email is updated in UI
- ✅ Name remains unchanged
- ✅ Data persists after refresh

## Test Case 4: Profile Update - Both Name and Email

### Steps
1. **Navigate to Profile Settings**
2. **Update Both Fields**
   - Change name to "Final Test Admin"
   - Change email to "final.admin@test.com"
   - Leave password fields empty
3. **Click "Save Changes"**
4. **Verify Results**
   - Success message appears
   - Both fields are updated
   - Data persists after refresh

### Expected Results
- ✅ Both fields updated successfully
- ✅ Success message displayed
- ✅ Data persistence confirmed

## Test Case 5: Invalid Email Format

### Steps
1. **Navigate to Profile Settings**
2. **Enter Invalid Email**
   - Enter "invalid-email" (no @ symbol)
   - Or enter "admin@" (incomplete)
   - Keep name field valid
3. **Click "Save Changes"**
4. **Verify Results**
   - Error message should appear: "Please enter a valid email address"
   - Form should not submit
   - Data should not be saved

### Expected Results
- ✅ Validation error displayed
- ✅ Form submission prevented
- ✅ No data changes in database
- ✅ Helpful error message shown

## Test Case 6: Required Field Validation

### Steps
1. **Navigate to Profile Settings**
2. **Clear Required Fields**
   - Clear the name field completely
   - Or clear the email field completely
3. **Click "Save Changes"**
4. **Verify Results**
   - Error message: "Name is required" or "Email is required"
   - Form submission prevented
   - No data saved

### Expected Results
- ✅ Required field validation works
- ✅ Appropriate error messages
- ✅ Form submission blocked

## Test Case 7: Password Change - Valid

### Steps
1. **Navigate to Profile Settings**
2. **Enter Password Data**
   - Current Password: "Admin123!"
   - New Password: "NewAdmin123!"
   - Confirm New Password: "NewAdmin123!"
   - Keep name/email fields unchanged
3. **Click "Save Changes"**
4. **Verify Results**
   - Success message appears
   - Password fields are cleared
   - Can logout and login with new password

### Expected Results
- ✅ Password changed successfully
- ✅ Success message displayed
- ✅ Password fields cleared after save
- ✅ Can authenticate with new password

### Verification
```bash
# Test login with new password
curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"final.admin@test.com","password":"NewAdmin123!"}'
```

## Test Case 8: Password Change - Invalid Current Password

### Steps
1. **Navigate to Profile Settings**
2. **Enter Wrong Current Password**
   - Current Password: "WrongPassword123!"
   - New Password: "NewAdmin123!"
   - Confirm New Password: "NewAdmin123!"
3. **Click "Save Changes"**
4. **Verify Results**
   - Error message: "Current password is incorrect"
   - Form submission prevented
   - Password fields not cleared

### Expected Results
- ✅ Authentication error displayed
- ✅ Password not changed
- ✅ Helpful error message

## Test Case 9: Password Change - Weak Password

### Steps
1. **Navigate to Profile Settings**
2. **Enter Weak Password**
   - Current Password: "NewAdmin123!" (assuming previous test passed)
   - New Password: "weak" (doesn't meet requirements)
   - Confirm New Password: "weak"
3. **Click "Save Changes"**
4. **Verify Results**
   - Error message about password requirements
   - Real-time validation should show requirements
   - Form submission prevented

### Expected Results
- ✅ Password validation works
- ✅ Requirements displayed
- ✅ Form submission blocked

## Test Case 10: Password Change - Mismatched Passwords

### Steps
1. **Navigate to Profile Settings**
2. **Enter Mismatched Passwords**
   - Current Password: "NewAdmin123!"
   - New Password: "NewAdmin456!"
   - Confirm New Password: "DifferentPassword123!"
3. **Click "Save Changes"**
4. **Verify Results**
   - Error: "New passwords do not match"
   - Real-time validation shows mismatch
   - Form submission prevented

### Expected Results
- ✅ Password matching validation works
- ✅ Real-time feedback provided
- ✅ Form submission blocked

## Test Case 11: Loading States

### Steps
1. **Navigate to Profile Settings**
2. **Initiate Save Operation**
   - Make changes to profile
   - Click "Save Changes"
3. **Observe Loading State**
   - Button should show "Saving..."
   - Button should be disabled
   - Form fields should be disabled

### Expected Results
- ✅ Loading state displayed
- ✅ Button disabled during save
- ✅ User cannot make changes during save

## Test Case 12: Unauthorized Access

### Steps
1. **Clear Authentication**
   - Clear localStorage/cookies
   - Or use expired token
2. **Navigate to Profile Settings**
3. **Verify Redirect**
   - Should redirect to login page
   - Should show appropriate error

### Expected Results
- ✅ Unauthorized users redirected
- ✅ Error handling works
- ✅ Security enforced

## Test Case 13: Network Error Handling

### Steps
1. **Simulate Network Issues**
   - Turn off internet connection
   - Or stop the backend server
2. **Try to Save Changes**
   - Make profile changes
   - Click "Save Changes"
3. **Verify Error Handling**
   - Appropriate error message shown
   - App doesn't crash
   - User can retry

### Expected Results
- ✅ Network errors handled gracefully
- ✅ User-friendly error messages
- ✅ App remains functional

## Test Case 14: Concurrent Updates

### Steps
1. **Open Two Browser Tabs**
   - Both logged in as same admin
   - Both on Profile Settings page
2. **Make Different Changes**
   - Tab 1: Change name to "Concurrent Admin 1"
   - Tab 2: Change name to "Concurrent Admin 2"
3. **Save Sequentially**
   - Save Tab 1 changes
   - Then save Tab 2 changes
4. **Verify Results**
   - Last save should win
   - No data corruption
   - Proper conflict resolution

### Expected Results
- ✅ Concurrent updates handled
- ✅ Data integrity maintained
- ✅ Last write wins strategy

## Test Case 15: Accessibility Testing

### Steps
1. **Keyboard Navigation**
   - Tab through all form fields
   - Verify focus indicators
   - Test keyboard shortcuts
2. **Screen Reader Support**
   - Test with screen reader software
   - Verify field labels are read
   - Check error announcements
3. **Color Contrast**
   - Verify text meets contrast requirements
   - Test with high contrast mode

### Expected Results
- ✅ Fully keyboard accessible
- ✅ Screen reader compatible
- ✅ Proper color contrast

## Test Case 16: Mobile Responsiveness

### Steps
1. **Test on Mobile Viewport**
   - Use browser dev tools mobile simulation
   - Or test on actual mobile device
2. **Verify Layout**
   - Form fields properly sized
   - Buttons easily tappable
   - Text readable without zooming
3. **Test Functionality**
   - All features work on mobile
   - Touch interactions work properly

### Expected Results
- ✅ Responsive design works
- ✅ Touch-friendly interface
- ✅ Full functionality on mobile

## Performance Testing

### Load Time Testing
1. **Measure Page Load Time**
   - Navigate to profile settings
   - Measure time to interactive
   - Should be < 3 seconds

### Save Operation Testing
1. **Measure Save Response Time**
   - Make profile changes
   - Measure time from click to response
   - Should be < 1 second

### Memory Usage Testing
1. **Monitor Memory Usage**
   - Check browser memory tab
   - Look for memory leaks
   - Verify cleanup after navigation

## Security Testing

### Input Validation Testing
1. **XSS Prevention**
   - Try injecting script tags in name field
   - Verify sanitization works
   - Check for script execution

2. **SQL Injection Prevention**
   - Try SQL injection in email field
   - Verify proper escaping
   - Check database logs

### Authentication Testing
1. **Token Validation**
   - Test with invalid tokens
   - Test with expired tokens
   - Verify proper rejection

## Bug Reporting Template

When reporting bugs, include:
- **Browser and Version:** Chrome 120.0, Firefox 119.0, etc.
- **Operating System:** Windows 11, macOS 14.0, Ubuntu 22.04
- **Steps to Reproduce:** Detailed step-by-step instructions
- **Expected vs Actual:** What should happen vs what actually happened
- **Error Messages:** Any error messages shown
- **Console Errors:** Browser console errors
- **Network Requests:** Failed API calls (from Network tab)

## Test Completion Checklist

- [ ] All positive test cases pass
- [ ] All negative test cases properly handled
- [ ] Edge cases tested
- [ ] Performance requirements met
- [ ] Security requirements met
- [ ] Accessibility requirements met
- [ ] Mobile responsiveness verified
- [ ] Cross-browser compatibility tested
- [ ] Documentation updated with results

## Notes for Testers

1. **Clear Browser Data:** Between test runs, clear browser storage to ensure clean state
2. **Check Console:** Always check browser console for errors during testing
3. **Verify Database:** Use database queries to verify actual data changes
4. **Test Real Scenarios:** Think about how actual users would interact with the system
5. **Document Issues:** Take screenshots and detailed notes for any issues found
