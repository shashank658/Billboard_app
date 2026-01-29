# FEAT-0001 – Authentication & User Management

## Meta
- **Feature ID:** FEAT-0001
- **Status:** Approved
- **Phase:** 1
- **Owner:** Product
- **Primary Actor:** Admin
- **Secondary Actors:** Internal Users
- **Dependencies:** Clerk Auth
- **ADR References:** ADR-0001-use-drizzle

---

## 1. Objective

Provide secure authentication and centralized admin-controlled user management using Clerk.

---

## 2. In Scope (Phase 1)

### Authentication
- Email + password login using Clerk
- JWT-based session handling
- Logout
- Password reset via email
- Email verification

### User Management
- Admin-only user creation
- User activation / deactivation
- Soft delete users
- User listing and basic profile management

---

## 3. Out of Scope

- Role-based access control (RBAC)
- Permissions management
- Social login (Google, Microsoft, etc.)
- Self-service sign-up
- Multi-tenant organizations
- SSO / LDAP
- Customer / advertiser users

---

## 4. User Types (Phase 1)

| User Type | Description |
|----------|-------------|
| ADMIN    | Can manage users |
| USER     | Can log in and access application |

> User types are **system flags**, not permission models.

---

## 5. Functional Requirements

### FR-1: Login
- Users authenticate using email + password via Clerk
- Inactive users must be blocked
- Error messages must not reveal credential validity

**Acceptance Criteria**
- Valid credentials → login success
- Invalid credentials → generic error
- Inactive user → access denied

---

### FR-2: Session Management
- JWT managed by Clerk
- Auto-refresh enabled
- Session timeout: 8 hours

---

### FR-3: Password Reset
- Reset link sent via email
- Token expiry enforced

---

### FR-4: Create User (Admin Only)
Admin can create a user with:
- Full name
- Email
- User type (ADMIN / USER)
- Status (Active / Inactive)

System behavior:
- Create user in Clerk
- Persist user record in application DB
- Send invite email

**Acceptance Criteria**
- Duplicate emails are rejected
- User type is mandatory
- User cannot log in if inactive

---

### FR-5: Edit User (Admin Only)
Admin can:
- Activate / deactivate user
- Change user type (ADMIN / USER)

Constraints:
- Email change is not supported in Phase 1

---

### FR-6: Delete User
- Users are soft deleted
- Login access permanently blocked
- Historical data ownership retained

---

## 6. Audit Logging (Minimal – Phase 1)

Events to be logged:
- User created
- User activated / deactivated
- User type changed
- Login success / failure

Log fields:
- actorUserId
- action
- targetUserId (nullable)
- timestamp

---

## 7. Non-Functional Requirements

- Passwords must never be stored in application DB
- OWASP Top-10 compliance
- Maximum supported users: 1,000
- Auth failures must not crash the application

---

## 8. Test Coverage Requirements

### Unit / Integration
- Auth service logic
- User lifecycle management
