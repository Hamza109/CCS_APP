/**
 * node chargesheet-status-loop.js
 * ICJS / NAPIX – Chargesheet Status API
 */

const https = require("https");
const crypto = require("crypto");

/* ================= CONFIG ================= */

const AUTHENTICATION_KEY = "sHtqzV8DP88en0jc"; // AES key (16 bytes)
const IV = "sHtqzV8DP88en0jc";                 // AES IV (16 bytes)
const HMAC_KEY = "15081947";

const DEPT_ID = "achalsethi1972%40ecourts.gov.in";

const HOST = "delhigw.napix.gov.in";
const TOKEN_PATH = "/nic/ecourts/oauth2/token";
const API_PATH =
  "/nic/ecourts/dc-icjs-chargesheet-status-api/chargesheetDetails";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 3000;
const THROTTLE_MS = 1500;

/* ================= HELPERS ================= */

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function* dateRange(start, end) {
  let current = new Date(start);
  const last = new Date(end);

  while (current <= last) {
    yield formatDate(current);
    current.setDate(current.getDate() + 1);
  }
}

function buildInputStr(p) {
  return (
    `transaction_date='${p.transaction_date}'|` +
    `state_code='${p.state_code}'`
  );
}

function hmacSha256Hex(message) {
  return crypto
    .createHmac("sha256", HMAC_KEY)
    .update(message, "utf8")
    .digest("hex");
}

function aesEncryptBase64(plain) {
  const cipher = crypto.createCipheriv(
    "aes-128-cbc",
    Buffer.from(AUTHENTICATION_KEY, "utf8"),
    Buffer.from(IV, "utf8")
  );

  return Buffer.concat([
    cipher.update(plain, "utf8"),
    cipher.final(),
  ]).toString("base64");
}

function aesDecryptBase64(b64) {
  const decipher = crypto.createDecipheriv(
    "aes-128-cbc",
    Buffer.from(AUTHENTICATION_KEY, "utf8"),
    Buffer.from(IV, "utf8")
  );

  return Buffer.concat([
    decipher.update(Buffer.from(b64, "base64")),
    decipher.final(),
  ]).toString("utf8");
}

function safeJsonParse(body) {
  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}

function httpsRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (d) => (data += d));
      res.on("end", () =>
        resolve({ status: res.statusCode, body: data })
      );
    });
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

/* ================= TOKEN ================= */

async function getAccessToken() {
  const res = await httpsRequest(
    {
      method: "POST",
      hostname: HOST,
      path: TOKEN_PATH,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic OTlhOTcwMmE5MTJlOTVmMzJlM2JkZmIxNWJjNDM1ZTA6NDliNjg5NTMwMzJjMmUwY2RkYWFlMWUxYzJkOTE1Yjg=",
      },
    },
    "scope=napix&grant_type=client_credentials"
  );

  const json = safeJsonParse(res.body);
  if (!json || !json.access_token) {
    throw new Error("Failed to fetch access token");
  }

  return json.access_token;
}

/* ================= API CALL ================= */

async function callChargesheetAPI(accessToken, params, attempt = 1) {
  try {
    const inputStr = buildInputStr(params);
    const request_str = aesEncryptBase64(inputStr);
    const request_token = hmacSha256Hex(inputStr);

    const path =
      `${API_PATH}?dept_id=${DEPT_ID}` +
      `&request_str=${encodeURIComponent(request_str)}` +
      `&request_token=${encodeURIComponent(request_token)}` +
      `&version=v1.0`;

    const res = await httpsRequest({
      method: "GET",
      hostname: HOST,
      path,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const json = safeJsonParse(res.body);

    if (!json) {
      throw new Error(`Non-JSON response: ${res.body}`);
    }

    if (json.response_str) {
      const decrypted = aesDecryptBase64(json.response_str);
      return {
        success: true,
        data: JSON.parse(decrypted),
      };
    }

    if (json.status) {
      const decryptedStatus = aesDecryptBase64(
        json.status
          .replace(/-/g, "+")
          .replace(/_/g, "/")
          .padEnd(
            json.status.length + (4 - json.status.length % 4) % 4,
            "="
          )
      );

      return {
        success: false,
        status: decryptedStatus,
      };
    }

    return { success: false, status: "Unknown response format" };
  } catch (err) {
    if (attempt < MAX_RETRIES) {
      console.warn(
        `⚠️ Attempt ${attempt} failed. Retrying in ${RETRY_DELAY_MS}ms...`
      );
      await sleep(RETRY_DELAY_MS);
      return callChargesheetAPI(accessToken, params, attempt + 1);
    }

    return {
      success: false,
      error: err.message,
    };
  }
}

/* ================= EXEC ================= */

(async () => {
  try {
    console.log("🔑 Fetching access token...");
    const token = await getAccessToken();
    console.log("✅ Token acquired\n");

    const START_DATE = "2019-01-01";
    const END_DATE = "2019-01-31";

    for (const txnDate of dateRange(START_DATE, END_DATE)) {
      console.log(`🔍 Checking transaction_date = ${txnDate}`);

      const params = {
        transaction_date: txnDate,
        flag: "N",  
        state_code: "01", // use "07" if Delhi requires it in your environment
      };

      const result = await callChargesheetAPI(token, params);

      if (result.success) {
        const cases =
          result.data?.icjs_chargesheet_case_info || [];

        if (cases.length > 0) {
          console.log("🎉 DATA FOUND!");
          console.log(`📅 transaction_date = ${txnDate}`);
          console.dir(cases, { depth: null });
          break; // STOP when data found
        } else {
          console.log("   ↳ Empty (no updates)");
        }
      } else {
        console.log("   ⚠️", result.status || result.error);
      }

      await sleep(THROTTLE_MS); // IMPORTANT: do not remove
    }

    console.log("\n✅ Date scan completed.");
  } catch (err) {
    console.error("❌ FATAL ERROR:", err.message);
  }
})();
