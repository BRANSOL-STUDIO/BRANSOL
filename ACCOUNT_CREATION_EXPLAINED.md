# How Users Create Accounts - Explained

## ✅ **THIS IS HOW USERS CREATE ACCOUNTS** (What You Need)

### **Regular User Signup** - `/signup`

**This is how customers create accounts to use your system:**

1. User visits `/signup`
2. User enters:
   - Full Name
   - Email
   - Password
3. Account is created in Supabase
4. User can log in at `/login`
5. User can access dashboard at `/dashboard`

**OR**

1. User purchases a subscription at `/subscriptions/checkout`
2. Payment is processed via Stripe
3. Account is **automatically created** (via webhook)
4. Password is sent in receipt email
5. User can log in at `/login`

---

## ❌ **THIS IS NOT FOR USER SIGNUPS** (You Don't Need This)

### **Stripe Connect** - `/dashboard/connect`

**This is ONLY if you wanted to let users sell products (which you don't):**

- ❌ NOT for user signups
- ❌ NOT for customers to use your system
- ✅ ONLY if you wanted a marketplace where users sell products
- ✅ ONLY if you wanted to take fees from user sales

**Since you're the only seller, you don't need Stripe Connect at all.**

---

## Your Actual User Flow

### **Option 1: Manual Signup**
```
User → /signup → Creates Account → /login → /dashboard
```

### **Option 2: Purchase Creates Account**
```
User → /subscriptions → Selects Plan → Pays → Account Created Automatically → Receives Email → /login → /dashboard
```

---

## Summary

| Page | Purpose | Do You Need It? |
|------|---------|-----------------|
| `/signup` | Users create accounts | ✅ **YES - This is your signup** |
| `/login` | Users log in | ✅ **YES - This is your login** |
| `/subscriptions/checkout` | Users buy subscriptions | ✅ **YES - This is your checkout** |
| `/dashboard/connect` | Stripe Connect (marketplace) | ❌ **NO - You don't need this** |

---

## What to Do

**You can ignore/remove the Stripe Connect pages:**
- `/dashboard/connect` - Not needed
- `/dashboard/connect/products` - Not needed
- `/dashboard/connect/subscription` - Not needed
- `/storefront/[accountId]` - Not needed
- `/app/api/connect/*` - Not needed

**Your users will:**
1. Sign up at `/signup` OR
2. Purchase at `/subscriptions/checkout` (account created automatically)

That's it! Simple and clean. 🎉

