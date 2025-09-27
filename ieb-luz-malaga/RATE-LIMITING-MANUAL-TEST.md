# Manual Rate Limiting Test

## Test the Rate Limiting Implementation

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Test Contact API Rate Limiting

Open a terminal and run these commands to test the contact API:

```bash
# Test 1: Normal request (should succeed)
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Subject",
    "message": "This is a test message for rate limiting"
  }'

# Test 2-6: Make 5 more requests quickly (should all succeed)
for i in {1..5}; do
  curl -X POST http://localhost:3000/api/contact \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Test User",
      "email": "test@example.com",
      "subject": "Test Subject",
      "message": "This is a test message for rate limiting"
    }'
  echo "Request $i completed"
done

# Test 7: 6th request (should be rate limited with 429 status)
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Subject",
    "message": "This is a test message for rate limiting"
  }'
```

### 3. Test Newsletter API Rate Limiting

```bash
# Test 1-3: Make 3 requests (should all succeed)
for i in {1..3}; do
  curl -X POST http://localhost:3000/api/newsletter \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test@example.com",
      "name": "Test User"
    }'
  echo "Newsletter request $i completed"
done

# Test 4: 4th request (should be rate limited with 429 status)
curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User"
  }'
```

### 4. Expected Results

#### Contact API (5 requests per 15 minutes):
- Requests 1-5: Status 201, success response
- Request 6+: Status 429, rate limit exceeded response

#### Newsletter API (3 requests per hour):
- Requests 1-3: Status 200, success response  
- Request 4+: Status 429, rate limit exceeded response

#### Rate Limit Response Format:
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "Muitas tentativas de contato. Tente novamente em 15 minutos.",
  "retryAfter": 900,
  "limit": 5,
  "remaining": 0,
  "resetTime": 1640995200000
}
```

#### Rate Limit Headers:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Timestamp when the window resets
- `X-RateLimit-Window`: Window duration in milliseconds
- `Retry-After`: Seconds to wait before retrying

### 5. Test Different IP Addresses

To test that rate limiting works per IP address, you can use different IP addresses:

```bash
# Simulate different IP addresses using curl
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -H "X-Forwarded-For: 192.168.1.100" \
  -d '{"name": "User 1", "email": "user1@example.com", "subject": "Test", "message": "Test message"}'

curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -H "X-Forwarded-For: 192.168.1.101" \
  -d '{"name": "User 2", "email": "user2@example.com", "subject": "Test", "message": "Test message"}'
```

Both requests should succeed because they're from different IP addresses.

### 6. Configuration Testing

You can test different rate limiting configurations by setting environment variables:

```bash
# Test with stricter limits
RATE_LIMIT_CONTACT_MAX_REQUESTS=2 npm run dev

# Test with longer windows
RATE_LIMIT_CONTACT_WINDOW_MS=60000 npm run dev  # 1 minute

# Disable rate limiting
RATE_LIMITING_ENABLED=false npm run dev
```

### 7. Monitoring

Check the browser developer tools or server logs to see:
- Rate limit headers in responses
- Rate limiting decisions in console logs
- Memory usage of the rate limiting store

### 8. Cleanup

After testing, you can clear the rate limiting store by restarting the development server, or wait for the automatic cleanup (every 5 minutes).

## Success Criteria

✅ Rate limiting is working correctly when limits are exceeded
✅ Different IP addresses have separate rate limits
✅ Proper HTTP status codes (429) and headers are returned
✅ Rate limiting can be configured via environment variables
✅ Rate limiting gracefully handles errors
✅ Memory cleanup works correctly
✅ Different endpoints have different rate limits
