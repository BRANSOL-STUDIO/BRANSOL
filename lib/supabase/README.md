# Supabase Integration

This project is integrated with Supabase for authentication and database.

## Client Usage (Client Components)

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'

export default function ClientComponent() {
  const supabase = createClient()
  
  // Example: Fetch data
  const fetchData = async () => {
    const { data, error } = await supabase
      .from('your_table')
      .select('*')
    
    if (error) console.error(error)
    return data
  }
  
  // Example: Sign in
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) console.error(error)
    return data
  }
  
  return <div>Your component</div>
}
```

## Server Usage (Server Components & API Routes)

```typescript
import { createClient } from '@/lib/supabase/server'

export default async function ServerComponent() {
  const supabase = await createClient()
  
  // Example: Fetch data server-side
  const { data, error } = await supabase
    .from('your_table')
    .select('*')
  
  // Example: Get authenticated user
  const { data: { user } } = await supabase.auth.getUser()
  
  return <div>Your component with {data}</div>
}
```

## Environment Variables

Make sure `.env.local` contains:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (server-side only)
```

## Authentication Flow

The middleware automatically refreshes user sessions. To protect routes, uncomment the redirect logic in `middleware.ts`.

## Common Operations

### Sign Up
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
})
```

### Sign Out
```typescript
const { error } = await supabase.auth.signOut()
```

### Get Current User
```typescript
const { data: { user } } = await supabase.auth.getUser()
```

### Listen to Auth Changes
```typescript
supabase.auth.onAuthStateChange((event, session) => {
  console.log(event, session)
})
```

