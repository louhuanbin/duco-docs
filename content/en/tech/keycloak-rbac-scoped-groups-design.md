# Keycloak RBAC + Scoped Group Governance (Design Doc)

## 1. Purpose

Design a maintainable authorization model for an application with multiple
modules, where:

- Access is managed via **Keycloak client roles**.
- Permissions are assigned to **groups**, but **NOT inherited automatically
  through the org hierarchy**.
- A **parent group defines an “allowed scope”**, and only explicitly assigned
  permissions in a child “Access” group are effective.
- A **Bridge Server** (backend service) + **UI** enforces governance rules and
  manages Keycloak Admin API calls.

This document defines a pattern that avoids Keycloak’s built-in group role
inheritance pitfalls by enforcing **“roles only on leaf Access groups.”**

---

## 2. Key Constraints (Keycloak Behavior)

Keycloak group hierarchy has **automatic inheritance**:

- If a group has role mappings, **all sub-groups inherit them** (effective
  permissions flow down).
- This inheritance **cannot be disabled**.

Therefore, we must avoid assigning permissions to any group that has children.

---

## 3. Solution Summary

### 3.1 Authorization Enforcement (Effective Permissions)

Use **client roles** on an application client (e.g., `my-app`) and grant them via
**leaf “Access” groups** only:

- Effective permissions = roles mapped to Access groups the user belongs to.

### 3.2 Governance Boundary (“Allowed Scope”)

Store **allowed scope** on _structural groups_ as **group attributes**:

- These attributes define which roles are allowed to be assigned somewhere under
  this subtree.
- Keycloak does not enforce this automatically; the Bridge Server + UI enforce
  it.
- The group attributes key is `clientRolesScope` and value is array of string

### 3.3 Group Pattern

Maintain **two layers in one tree**:

- **Structural Groups**: organizational hierarchy, **no role mappings**
- **Access Groups**: leaf nodes under a structural group, **role mappings
  allowed**

Example:

- `/org/DeptA/Team1` (structural, no roles)
  - `/org/DeptA/Team1/Access` (leaf, roles mapped here)

---

## 4. Design Pattern (Clarification)

This is a **“Permission Boundary + Explicit Grants”** pattern:

### Structural group (Parent)

- Defines **what may be granted** under it.
- Stores scope in attributes only (allowed roles list in `clientRolesScope`).

### Access group (Leaf)

- Stores **what is actually granted** (client role mappings).
- Users are assigned to Access groups for permissions.
- User do not have any role mapping, ulti explicitely grant, while what roles can
  be grant is decied by intersection of all `clientRolesScope` found along
  ancestor chain.

### Why it works

- Prevents accidental inheritance because **roles never exist on nodes with
  children**.
- Permission changes remain local to Access nodes.
- Governance is enforced centrally through the Bridge Server.

---

## 5. Keycloak Data Model

### 5.1 Client + Roles

Create a single client for the application: `my-app`

Define client roles per module:

- `moduleA.read`, `moduleA.write`, `moduleA.admin`
- `moduleB.read`, `moduleB.write`, `moduleB.admin`
- ...

Optional: composites (recommended to reduce admin burden)

- `moduleA.editor` = `moduleA.read` + `moduleA.write`
- `moduleA.viewer` = `moduleA.read`

### 5.2 Groups

Structural groups form the hierarchy:

- `/org/DeptA/Team1`
- `/org/DeptA/Team2`

Each structural group contains exactly one Access group:

- `/org/DeptA/Team1/Access`
- `/org/DeptA/Team2/Access`

**Rule:** Only `/Access` groups are allowed to have role mappings.

### 5.3 Group Attributes (Scope)

On structural groups store an attribute `clientRolesScope` that defines allowed
roles under the subtree.

Example values:

```text
clientRolesScope = ["moduleA.read", "moduleA.write", "moduleB.read"]
```

---

## 6. Effective Scope Computation

When assigning roles to an Access group, the system computes its **effective
allowed scope** from ancestors.

EffectiveAllowedRoles = intersection of all `clientRolesScope` found along
ancestor chain.

---

## 7. Bridge Server Responsibilities

The Bridge Server is the governance/enforcement layer between the UI and Keycloak
Admin REST API.

### 7.1 Core Functions

1. **Read structure**
   - List groups, children, and attributes.
2. **Manage Access groups**
   - Ensure each structural group has exactly one `/Access` child (create if
     missing).
3. **Role assignment to Access groups**
   - Allow only roles within effective allowed scope.
4. **User membership**
   - Add/remove users to/from Access groups.
5. **Scope enforcement & cascade cleanup**
   - When allowed scope changes, remove invalid roles from descendant Access
     groups.

### 7.2 Invariants Enforced by Bridge Server

- Structural groups must have **no role mappings**.
- Only `/Access` groups can have role mappings.
- Access group roles must be subset of its effective allowed scope.
- Every structural group has at most one Access group (or a fixed naming
  convention).

---

## 8. UI Workflow (Admin Experience)

### 8.1 Manage Allowed Scope (Structural Group)

UI: “Allowed roles under this team”

- Admin selects structural group (e.g., `/org/DeptA/Team1`)
- UI updates `auth.allowed_roles` via Bridge Server

On save:

- Bridge Server triggers **cascade reconciliation** (see Section 9)

### 8.2 Manage Effective Permissions (Access Group)

UI: “Permissions for this team”

- Admin selects structural group
- UI resolves Access group (`/Access`)
- UI lists:
  - Current assigned roles (from role mappings on Access group)
  - Allowed roles (computed effective scope)
- UI only allows selecting roles within allowed scope

### 8.3 Assign Users

UI: “Users”

- Admin adds user to `/Access` group to grant access

---

## 9. Cascade Reconciliation (Scope Removal Handling)

When allowed scope is reduced at a structural node:

- Descendant Access groups may have roles that are now invalid.

Bridge Server must:

1. Traverse all descendants under that structural group.
2. Identify all Access groups.
3. For each Access group:
   - Compute its effective allowed scope.
   - Fetch current role mappings.
   - Remove any roles not in allowed scope.

Notes:

- This should be idempotent.
- Run immediately on change (sync) or via job queue (async).
- Log all removals for auditability.

---

## 10. Recommended Bridge Server API (Minimal)

These endpoints are internal/admin APIs for the UI.

### Group Discovery

- `GET /auth/groups/tree?root=/org`
- `GET /auth/groups/{groupId}/effective-scope`

### Scope Management (Structural group attributes)

- `PUT /auth/groups/{groupId}/allowed-roles`
  - body: `{ "allowedRoles": ["moduleA.read", ...], "mode": "intersection" }`

### Access Group Operations

- `GET /auth/groups/{groupId}/access-group`
- `POST /auth/groups/{groupId}/access-group` (create if missing)

### Role Mapping Management (Access group only)

- `GET /auth/access-groups/{accessGroupId}/roles`
- `PUT /auth/access-groups/{accessGroupId}/roles`
  - body: `{ "roles": ["moduleA.read", "moduleB.editor"] }`
  - Bridge Server enforces scope

### Membership

- `GET /auth/access-groups/{accessGroupId}/members`
- `PUT /auth/access-groups/{accessGroupId}/members`
  - body: `{ "add": ["userId1"], "remove": ["userId2"] }`

### Reconciliation

- `POST /auth/groups/{groupId}/reconcile`
  - manually trigger reconciliation (for recovery/testing)

---

## 11. Token Contract for Application Services

Application services authorize requests based on **roles** in the JWT.

Expected checks:

- Module access:
  - `moduleA.read` required for read endpoints
  - `moduleA.write` required for write endpoints
  - `moduleA.admin` required for admin endpoints

Do **not** authorize using group paths; use role claims only.

---

## 12. Security & Permissions (Keycloak Admin API Access)

Bridge Server should use a Keycloak service account with least privilege:

- read groups
- manage group memberships
- manage group role mappings
- read/manage client roles for `my-app`

This should be done via:

- `realm-management` client roles (e.g., `query-groups`, `manage-users`,
  `manage-realm`, etc.) Exact roles depend on your operational model.

---

## 13. Implementation Checklist

### Keycloak Setup

- [ ] Create client `my-app`
- [ ] Define module roles (+ composites)
- [ ] Create top-level group `/org`

### Bridge Server Setup

- [ ] Authenticate to Keycloak Admin API using client credentials
- [ ] Implement group tree retrieval
- [ ] Implement Access group resolution/creation
- [ ] Implement effective scope computation
- [ ] Implement role mapping assignment with enforcement
- [ ] Implement scope update + cascade reconciliation
- [ ] Add audit logs for changes and reconciliations

### UI Setup

- [ ] Group tree view (structural)
- [ ] Allowed scope editor (structural group attribute editor)
- [ ] Permissions editor (Access group role mappings)
- [ ] User membership management (Access group members)

---

## 14. Non-Goals

- Resource-level authorization (project/document-level checks)
- ReBAC/relationship-based permissions
- Delegated admin inside Keycloak (beyond what the Bridge Server enforces)

---

## 15. Result

This model provides:

- Simple runtime authorization: **JWT role checks**
- Strong governance: **parent scope boundaries enforced by Bridge Server**
- No accidental inheritance: **roles exist only on leaf Access groups**
- Predictable administration and reconciliation behavior
