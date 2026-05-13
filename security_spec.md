# Security Specification: Fashion Intelligence OS

## Data Invariants
1. A **FashionItem** can be read by any signed-in user (it's a global gallery), but only the owner (if specified) or a system user can create/update.
2. A **UserProfile** is strictly private to the owner. No other user can read or write to another user's profile.
3. **Moodboards** are private to the owner.
4. **Timestamps** (`createdAt`) must be set by the server.
5. **IDs** must conform to standard regex.

## The "Dirty Dozen" Payloads (Deny Tests)

1. **Identity Spoofing**: Create `fashion_items` with `userId` of another user.
2. **PII Leak**: Read `users/{anotherUserId}` profile from a different account.
3. **Ghost Field**: Update `fashion_items` with `isVerified: true` (unauthorized field).
4. **State Shortcutting**: Change terminal status (if we had any).
5. **ID Poisoning**: Use a 2KB string as a document ID.
6. **Resource Exhaustion**: Send a 1MB string into a `tags` array.
7. **Cross-Tenant Write**: Write to `users/{anotherUserId}/moodboards`.
8. **Invalid Type**: Set `sustainability` to a string instead of integer.
9. **Missing Required**: Create `fashion_items` without `imageUrl`.
10. **Immutable Field**: Change `createdAt` on update.
11. **Email Spoofing**: Access user data with an unverified email (if `email_verified` is required).
12. **Blanket Query**: Attempt to list all `users` profiles without a filter.

## Test Runner (TDD Draft)
These tests would be implemented in `firestore.rules.test.ts`.

```typescript
// Example Deny Test
test('another user cannot read profile', async () => {
  const db = authedDb({ uid: 'user_B' });
  await firebase.assertFails(db.doc('users/user_A').get());
});
```
