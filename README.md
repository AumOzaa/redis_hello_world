# Caching with Redis - Learning Project

A simple Node.js Express application demonstrating Redis caching for API responses.

## Learning Outcomes

This project covers fundamental Redis concepts used for caching:

### Redis Commands Used

| Command | Purpose | Example |
|---------|---------|---------|
| `GET` | Retrieve data from cache | `redisClient.get(todoId)` |
| `SET` | Store data in cache | `redisClient.set(key, value, options)` |
| `EX` | Set expiration time (seconds) | `EX: 120` (2 minutes) |
| `NX` | Set only if key doesn't exist | `NX: true` |

### Redis Configuration

```javascript
redis.createClient({
    host: 'redis-server',
    port: 6379
})
```

### Cache Logic Flow

1. Check if data exists in cache using `GET`
2. If found (cache hit): return cached data
3. If not found (cache miss): fetch from API, then store in cache with `SET`
4. Cache entries expire after 120 seconds (`EX: 120`)

## API Endpoint

### GET /todos/:todoId

Fetches a todo item with optional caching.

**Example:**
```
GET http://localhost:3000/todos/1
```

**Response (cache hit):**
```json
{
  "fromCached": true,
  "data": { "userId": 1, "id": 1, "title": "...", "completed": false }
}
```

**Response (cache miss):**
```json
{
  "fromCached": false,
  "data": { "userId": 1, "id": 1, "title": "...", "completed": false }
}
```

## Redis Key-Value Store

- **Key:** `todoId` (e.g., "1", "2", "3")
- **Value:** JSON stringified todo object
- **TTL:** 120 seconds

## Technologies Used

- Node.js
- Express.js
- Redis (via `redis` package)
- axios (for API calls)
