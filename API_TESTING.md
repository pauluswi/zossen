# API Testing with cURL

This document provides `curl` commands to manually test the security endpoints of the Zossen application.

## Scenario 1: Happy Path (Successful Approval)

This test simulates a user with the correct permissions (`ROLE_ADMIN` or `ROLE_SUPERVISOR`) successfully approving a transaction.

### Test Script

This script automates the two-step process:
1.  Fetches an access token for the `admin` user.
2.  Uses that token to make an authorized request to the `/backoffice/approve` endpoint.

```sh
#!/bin/bash

# --- Step 1: Get an access token for a user with the 'ROLE_ADMIN' role ---
echo "🔑 Requesting token for 'admin' user..."

TOKEN=$(curl -s -X POST "http://localhost:8080/mock-idp/token?username=admin" | jq -r .access_token)

if [[ -z "$TOKEN" || "$TOKEN" == "null" ]]; then
    echo "❌ Error: Could not retrieve token. Is the application running and is 'jq' installed?"
    exit 1
fi

echo "✅ Token received successfully."
echo ""

# --- Step 2: Use the token to call the protected approval endpoint ---
echo "🚀 Making authorized request to /backoffice/approve..."

# Using a realistic 12-digit transaction ID (e.g., 025093000001)
curl -i -X POST "http://localhost:8080/backoffice/approve?transactionId=025093000001" \
-H "Authorization: Bearer $TOKEN"

echo ""
```

### How to Run

1.  Ensure the Zossen Spring Boot application is running.
2.  Make sure you have `jq` installed (a command-line JSON processor).
3.  Copy the script above and execute it in your terminal.

### Understanding the Output

The `-i` flag in the `curl` command tells it to include the HTTP response headers in the output. This is crucial for verifying our security configuration.

#### Expected Output Sample

```
HTTP/1.1 200 OK
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: SAMEORIGIN
Content-Security-Policy: script-src 'self'; object-src 'none';
Content-Type: application/json
...

{"status":"SUCCESS","message":"Transaction approved and executed securely","transactionId":"025093000001"}
```

#### Explanation

*   **`HTTP/1.1 200 OK`**: This is the HTTP status code confirming the request was successful.
*   **`Strict-Transport-Security` (HSTS)**: This header is sent by our server (configured in `SecurityConfig.java`) to tell the browser it must only use HTTPS for future requests.
*   **`X-Frame-Options`**: Our server sends this header to prevent clickjacking. `SAMEORIGIN` tells the browser it cannot be embedded in an `<iframe>` on another domain.
*   **`Content-Security-Policy` (CSP)**: Our server sends this header to prevent XSS attacks by defining which resources a browser is allowed to load.
*   **JSON Body**: This is the success response from our `TransactionApprovalController`.

**Key Takeaway**: The `curl` command **does not implement** these headers. It simply **displays the headers that the server sends**. This output confirms that our server-side security configuration in `SecurityConfig.java` is working correctly.
