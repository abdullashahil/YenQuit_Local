# hooks/

This directory contains custom React hooks.

## Examples:
- `useAuth.ts` - Authentication hook
- `useLocalStorage.ts` - Local storage hook
- `useMediaQuery.ts` - Responsive design hook

## Usage:
```typescript
// src/hooks/useAuth.ts
import { useAppContext } from '../context/AppContext'

export function useAuth() {
  const { userType, logout } = useAppContext()
  
  return {
    isAuthenticated: !!userType,
    isAdmin: userType === 'admin',
    logout
  }
}
```
