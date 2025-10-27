# lib/

This directory contains third-party library configurations and clients.

## Examples:
- Firebase configuration
- API clients
- External service integrations
- Database connections

## Usage:
```typescript
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app'

export const firebaseConfig = {
  // your config
}

export const app = initializeApp(firebaseConfig)
```
