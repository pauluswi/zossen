
    [Backoffice UI]
          │
          │ 1. Login (User/Pass)
          ▼
    [Mock IdP (Keycloak)]
          │
          │ 2. Returns JWT (Access Token)
          │    (Claims: roles, scopes, sub)
          ▼
    [Backoffice UI]
          │
          │ 3. API Request + Bearer Token
          ▼
    [Backend API]
          │
          │ 4. Validate Token (Signature/Exp)
          │ 5. Extract Identity & Roles
          ▼
    [Z-Trust API Gateway]
          │
          │ 6. Enforce Zero Trust Policy
          │    (RBAC + Context + Replay Check)
          ▼
    [Z-Trust Middleware]
          │
          │ 7. Execute Transaction
          │ 8. Audit Log (Immutable)
          ▼
    [Mock Core Banking]
