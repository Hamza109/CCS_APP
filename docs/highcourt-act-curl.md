# DC Act API – cURL examples

The app calls the eCourts DC Act API directly (same pattern as other high court APIs). Below are equivalent cURL commands.

## 1. Get OAuth token

```bash
curl -X POST 'https://delhigw.napix.gov.in/nic/ecourts/oauth2/token' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'Authorization: Basic OTlhOTcwMmE5MTJlOTVmMzJlM2JkZmIxNWJjNDM1ZTA6NDliNjg5NTMwMzJjMmUwY2RkYWFlMWUxYzJkOTE1Yjg=' \
  -d 'scope=napix&grant_type=client_credentials'
```

Use the `access_token` from the response in step 2.

## 2. Call DC Act API

- **inputStr** = pipe-separated params, e.g. `act_code='IPC'` or `act_code='IPC'|year='2020'`
- **request_str** = Base64(AES-128-CBC encrypt(inputStr)) with key/IV = `sHtqzV8DP88en0jc`
- **request_token** = HMAC-SHA256(inputStr, key=`15081947`) in hex

Replace `YOUR_ACCESS_TOKEN`, `YOUR_REQUEST_STR`, and `YOUR_REQUEST_TOKEN` with values from the app (or from your own encryption/HMAC).

```bash
curl -X GET 'https://delhigw.napix.gov.in/nic/ecourts/dc-act-api/act?dept_id=achalsethi1972%40ecourts.gov.in&request_str=YOUR_REQUEST_STR&request_token=YOUR_REQUEST_TOKEN&version=v1.0' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```

## Usage in app

```ts
import { highCourtApi } from "@/services/highCourtApi";

// With params (e.g. act_code, year, state_code)
const data = await highCourtApi.getAct({ act_code: "IPC" });
// or
const data = await highCourtApi.getAct({ act_code: "IPC", year: "2020" });
```
