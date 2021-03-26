# GiTrack Backend

## Schema

All data sent and received as JSON

All timestamps return in ISO 8601 format:
YYYY-MM-DDTHH:MM:SSZ

Blank fields are included as null instead of being omitted.

## Routes

### Authentication

#### POST `/auth/register`

##### Parameters

| Name | Type | In | Description |
| `username` | string! | body | |
| `password` | string! | body | |
| `email` | string! | body | |

##### Expected Response

`Status: 201 Created`

```json
{
  "username": "string",
  "id": integer
}
```

#### POST `/auth/login`

| Name | Type | In | Description |
| `username` | string! | body | |
| `password` | string! | body | |

##### Response

`Status: 200 OK`

```json
{
  "id": "integer",
  "username": "string",
  "accessToken": "string",
  "refreshToken": "string"
}
```

#### POST `/auth/logout`

| Name | Type | In | Description |
| `refreshToken` | string! | body | |
| `accessToken` | string! | header | |

##### Response

`Status: 200 OK`

#### POST `/auth/refresh-token`

| Name | Type | In | Description |
| `refreshToken` | string! | body | |

##### Response

`Status: 200 OK`

```json
{
  "accessToken": "string"
}
```
