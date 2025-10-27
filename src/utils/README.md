# utils/

This directory contains utility functions and helpers.

## Examples:
- `formatDate.ts` - Date formatting utilities
- `validation.ts` - Form validation helpers
- `storage.ts` - Storage helpers
- `cn.ts` - Tailwind class merger (already included)

## Usage:
```typescript
// src/utils/formatDate.ts
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
```
