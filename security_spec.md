# Security Spec

## 1. Data Invariants
- A user document can only be created by the user themselves, their `userId` must match `request.auth.uid`.
- A watchlist item can only be created within a user's own `watchlist` subcollection.
- Only the authenticated user can read their own profile and watchlist items.

## 2. The "Dirty Dozen" Payloads
1. Create user profile for another UID. (Spoofed `request.auth.uid`)
2. Update another user's profile.
3. Access/Read another user's profile.
4. Modify an immutable field (e.g. `createdAt`) during profile update.
5. Create a profile without required fields.
6. Create a profile with invalid field types.
7. Injecting 1.5MB random string in `photoURL`.
8. Create a watchlist item in another user's subcollection.
9. Update a watchlist item without required schema compliance.
10. Update a watchlist item with a ghost field (e.g. `isAdmin: true`).
11. Read watchlist of another user.
12. Denial of wallet attack via missing size checks.

## 3. The Test Runner
Will be created in `firestore.rules.test.ts`.
