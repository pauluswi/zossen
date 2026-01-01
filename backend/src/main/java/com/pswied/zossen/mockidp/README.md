# 🪪 Mock Identity Provider (Mock Keycloak)

**JWT Issuer Simulation for Zero-Trust Architecture**

## Overview

The **Mock Identity Provider (Mock IdP)** simulates an external OAuth2 / OpenID Connect Identity Provider, such as Keycloak, for development and architectural demonstration purposes.

This module exists to decouple authentication concerns from business logic, allowing the platform to demonstrate Zero-Trust enforcement without requiring a live Keycloak deployment.

🔑 **Design Principle:**  
*Authentication is external.*  
*Authorization is enforced internally via Zero-Trust policies.*

## Why a Mock IdP?

In real banking systems:
1.  Identity Providers (Keycloak, Azure AD, Ping, etc.) are external systems
2.  Application services never issue tokens themselves
3.  Services only verify and trust signed tokens

For this showcase project:
*   A real Keycloak instance would add operational overhead
*   The focus is security architecture, not IdP operations

Therefore, this module mocks Keycloak behavior while preserving:
*   Real JWT structure
*   Cryptographic signing
*   Role & scope claims
*   Token validation realism

## Responsibilities

### ✅ What This Module Does
*   Simulates OAuth2 token issuance
*   Generates signed JWTs
*   Provides public keys for token verification
*   Embeds roles and scopes into claims
*   Mimics Keycloak-style token payloads

### ❌ What This Module Does NOT Do
*   User authentication (passwords, MFA, login)
*   Session management
*   Token revocation
*   User lifecycle management
*   Policy enforcement

⚠️ **Important:**  
*This module is not part of the Zero-Trust boundary.*  
*It represents an external trust source.*

## Module Structure

```
mockidp/
├── controller/
│   └── MockTokenController.java
├── jwt/
│   ├── JwtKeyProvider.java
│   └── JwtTokenGenerator.java
```

Each component mirrors real-world IdP responsibilities in a simplified form.

## MockTokenController

### Role
`MockTokenController` simulates the OAuth2 token endpoint typically exposed by Keycloak.

It allows developers to request JWT tokens for different roles and scopes, enabling realistic testing of Zero-Trust enforcement downstream.

### Example Endpoint (Conceptual)
`POST /mock-idp/token`

The response structure mimics a standard OAuth2 access token response.

## JwtKeyProvider

### Role
`JwtKeyProvider` manages cryptographic keys used to sign JWTs.

**Responsibilities include:**
*   Providing a signing key pair
*   Exposing the public key (or JWK equivalent)
*   Ensuring tokens can be verified by Resource Servers

**This simulates Keycloak’s:**
*   Realm keys
*   JWK endpoint
*   Key rotation concept (simplified)

## JwtTokenGenerator

### Role
`JwtTokenGenerator` creates standards-compliant JWTs.

**Typical claims include:**
*   `iss` (issuer)
*   `sub` (subject)
*   `aud` (audience)
*   `exp`, `iat`
*   `roles`
*   `scopes`
*   `client_id`

The generated tokens are intentionally compatible with:
*   Spring Security Resource Server
*   OAuth2 JWT decoders
*   Zero-Trust Gateway enforcement logic

## Interaction with Z-Trust Boundary

```
Mock IdP
   │  (JWT)
   ▼
Spring Security (Resource Server)
   │
   ▼
Z-Trust Security Gateway
```

1.  The Mock IdP issues identity
2.  Spring Security verifies the token
3.  Z-Trust Gateway enforces authorization and policy

*This separation mirrors real banking architectures.*

## Security Disclaimer

🚨 **This module is strictly for demonstration and development only.**

It must:
*   Never be deployed to production
*   Never replace a real IdP
*   Never be trusted outside controlled environments

In production, this module would be replaced by:
*   Keycloak
*   Azure AD
*   Okta
*   Ping Identity
*   Any certified OAuth2 / OIDC provider

## Architectural Value

This module demonstrates:
*   Clean separation of authentication and authorization
*   Externalized trust model
*   Zero-Trust readiness
*   Replaceable security components
*   Banking-grade security layering

🏦 *This pattern is commonly used in regulated environments to allow local development without weakening architecture.*

## Key Takeaway

**Identity is issued externally. Trust is never implicit.**  
The Mock IdP enables realistic Zero-Trust enforcement without operational complexity.
