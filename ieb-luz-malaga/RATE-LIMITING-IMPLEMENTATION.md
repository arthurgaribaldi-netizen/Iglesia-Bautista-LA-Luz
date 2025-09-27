# Rate Limiting Implementation Guide

## Overview

This implementation provides comprehensive rate limiting for public APIs (`/contact` and `/newsletter`) to prevent abuse and ensure fair usage of resources.

## Features

- **Configurable Rate Limits**: Different limits for different endpoints
- **IP-based Tracking**: Rate limiting based on client IP address
- **Memory Store**: In-memory storage with automatic cleanup
- **HTTP Headers**: Standard rate limit headers in responses
- **Environment Configuration**: Configurable via environment variables
- **Error Handling**: Graceful fallback when rate limiting fails
- **Monitoring Support**: Built-in monitoring and debugging utilities

## Configuration

### Environment Variables

Add these variables to your `.env.local` file:

```bash
# Contact API Rate Limiting
RATE_LIMIT_CONTACT_WINDOW_MS=900000      # 15 minutes
RATE_LIMIT_CONTACT_MAX_REQUESTS=5        # 5 requests per window

# Newsletter API Rate Limiting  
RATE_LIMIT_NEWSLETTER_WINDOW_MS=3600000 # 1 hour
RATE_LIMIT_NEWSLETTER_MAX_REQUESTS=3     # 3 requests per hour

# General API Rate Limiting
RATE_LIMIT_GENERAL_WINDOW_MS=900000      # 15 minutes
RATE_LIMIT_GENERAL_MAX_REQUESTS=100      # 100 requests per window

# Custom Messages (Optional)
RATE_LIMIT_CONTACT_MESSAGE="Muitas tentativas de contato. Tente novamente em 15 minutos."
RATE_LIMIT_NEWSLETTER_MESSAGE="Muitas tentativas de inscrição. Tente novamente em 1 hora."

# Enable/Disable Rate Limiting
RATE_LIMITING_ENABLED=true
```

### Default Configuration

| Endpoint | Window | Max Requests | Message |
|----------|--------|--------------|---------|
| `/api/contact` | 15 minutes | 5 | Contact form abuse prevention |
| `/api/newsletter` | 1 hour | 3 | Newsletter subscription abuse prevention |
| General APIs | 15 minutes | 100 | General API protection |

## Implementation Details

### Files Created/Modified

1. **`src/lib/rate-limit.ts`** - Main rate limiting logic
2. **`src/lib/rate-limit-config.ts`** - Configuration management
3. **`src/app/api/contact/route.ts`** - Updated with rate limiting
4. **`src/app/api/newsletter/route.ts`** - Updated with rate limiting

### Rate Limiting Algorithm

1. **Key Generation**: `{clientIP}:{endpoint}`
2. **Window Tracking**: Sliding window based on first request time
3. **Cleanup**: Automatic cleanup of expired entries every 5 minutes
4. **Headers**: Standard HTTP rate limit headers included in responses

### HTTP Headers

Rate limiting adds these headers to all responses:

- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Timestamp when the window resets
- `X-RateLimit-Window`: Window duration in milliseconds
- `Retry-After`: Seconds to wait before retrying (only on 429)

## Usage Examples

### Basic Implementation

```typescript
import { rateLimitContact } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await rateLimitContact(request, 'contact');
  if (rateLimitResponse) {
    return rateLimitResponse; // Returns 429 if limit exceeded
  }
  
  // Continue with normal processing...
}
```

### Custom Rate Limiting

```typescript
import { rateLimit } from '@/lib/rate-limit';

const customLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  maxRequests: 20,
  message: 'Custom rate limit message'
});

export async function POST(request: NextRequest) {
  const rateLimitResponse = await customLimiter(request, 'custom-endpoint');
  if (rateLimitResponse) {
    return rateLimitResponse;
  }
  // ...
}
```

## Response Format

### Success Response (200/201)
```json
{
  "success": true,
  "message": "Request processed successfully"
}
```

### Rate Limit Exceeded (429)
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

## Monitoring and Debugging

### Get Rate Limit Info

```typescript
import { getRateLimitInfo } from '@/lib/rate-limit';

const info = getRateLimitInfo('192.168.1.1', 'contact');
console.log(info);
// {
//   key: '192.168.1.1:contact',
//   remaining: 3,
//   resetTime: 1640995200000,
//   limit: 5,
//   windowMs: 900000
// }
```

### Store Access (for debugging)

```typescript
import { rateLimitStore } from '@/lib/rate-limit';

// Get all entries (for debugging)
console.log(rateLimitStore.store);

// Manual cleanup
rateLimitStore.cleanup();
```

## Security Considerations

1. **IP Spoofing**: The implementation checks multiple headers for real IP
2. **Memory Usage**: Automatic cleanup prevents memory leaks
3. **Graceful Degradation**: Rate limiting failures don't break the API
4. **Configuration Validation**: Invalid configurations are caught at startup

## Performance Impact

- **Memory Usage**: Minimal - only stores active rate limit entries
- **CPU Impact**: Negligible - simple increment operations
- **Network Impact**: None - all processing happens server-side
- **Cleanup Overhead**: Runs every 5 minutes, very lightweight

## Testing

### Manual Testing

1. **Test Normal Usage**:
   ```bash
   curl -X POST http://localhost:3000/api/contact \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Test message"}'
   ```

2. **Test Rate Limiting**:
   ```bash
   # Run the same request multiple times quickly
   for i in {1..6}; do
     curl -X POST http://localhost:3000/api/contact \
       -H "Content-Type: application/json" \
       -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Test message"}'
   done
   ```

3. **Check Headers**:
   ```bash
   curl -I -X POST http://localhost:3000/api/contact \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Test message"}'
   ```

### Automated Testing

Create test files in `__tests__/api/`:

```typescript
// __tests__/api/rate-limiting.test.ts
import { rateLimitContact } from '@/lib/rate-limit';

describe('Rate Limiting', () => {
  it('should allow requests within limit', async () => {
    // Test implementation
  });
  
  it('should block requests exceeding limit', async () => {
    // Test implementation
  });
});
```

## Future Enhancements

1. **Redis Support**: For distributed rate limiting
2. **User-based Limiting**: Rate limiting by authenticated user
3. **Dynamic Configuration**: Runtime configuration changes
4. **Analytics**: Rate limiting metrics and reporting
5. **Whitelist/Blacklist**: IP-based allow/deny lists

## Troubleshooting

### Common Issues

1. **Rate limiting not working**:
   - Check `RATE_LIMITING_ENABLED=true`
   - Verify configuration values are valid
   - Check console for configuration errors

2. **Too restrictive**:
   - Increase `maxRequests` values
   - Decrease `windowMs` values
   - Adjust per your use case

3. **Memory usage growing**:
   - Check cleanup interval is running
   - Verify window durations are reasonable
   - Monitor store size in production

### Debug Mode

Enable debug logging by setting:
```bash
DEBUG=rate-limit
```

This will log all rate limiting decisions and store operations.

## Production Considerations

1. **Monitoring**: Monitor rate limit hit rates and blocked requests
2. **Scaling**: Consider Redis for multi-instance deployments
3. **Configuration**: Use environment variables for easy adjustment
4. **Logging**: Log rate limit violations for security analysis
5. **Backup Plan**: Ensure graceful degradation if rate limiting fails

## Support

For issues or questions about rate limiting implementation:
1. Check this documentation
2. Review configuration values
3. Test with manual requests
4. Check application logs
5. Contact development team
