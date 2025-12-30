
    ┌──────────────────────────┐       ┌──────────────────────────┐
    │ Bielefeld Backoffice UI  │ <───> │ Mock IdP (Keycloak)      │
    │ (Ops / Approvals / Audit)│       │ (Auth / Tokens)          │
    └────────────┬─────────────┘       └──────────────────────────┘
                 │ OAuth2 (User)
    ┌────────────▼─────────────┐
    │ Backend API              │
    │ (Business Logic)         │
    └────────────┬─────────────┘
                 │ OAuth2 + mTLS (System)
    ┌────────────▼─────────────┐
    │ Z-Trust API Gateway      │
    │ - Zero Trust             │
    │ - Policy Enforcement     │
    └────────────┬─────────────┘
                 │ mTLS
    ┌────────────▼─────────────┐
    │ Z-Trust Middleware       │
    │ (Txn / Audit / Security) │
    └────────────┬─────────────┘
                 │
    ┌────────────▼─────────────┐
    │ Mock Core Banking / ISO  │
    └──────────────────────────┘
