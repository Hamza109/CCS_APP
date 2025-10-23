import axios from "axios";
import * as CryptoJS from "crypto-js";

// Constants taken from the PHP implementation
const AUTHENTICATION_KEY = "sHtqzV8DP88en0jc"; // also used as IV in PHP
const IV = "sHtqzV8DP88en0jc";
const HMAC_KEY = "15081947";
const DEPT_ID = "achalsethi1972%40ecourts.gov.in";

function aesEncryptBase64(plain: string): string {
  const key = CryptoJS.enc.Utf8.parse(AUTHENTICATION_KEY);
  const iv = CryptoJS.enc.Utf8.parse(IV);
  const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(plain), key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  // CryptoJS returns base64 by default
  return encrypted.toString();
}

function aesDecryptBase64ToJson<T = any>(b64Cipher: string): T {
  const key = CryptoJS.enc.Utf8.parse(AUTHENTICATION_KEY);
  const iv = CryptoJS.enc.Utf8.parse(IV);
  const decrypted = CryptoJS.AES.decrypt(b64Cipher, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const text = decrypted.toString(CryptoJS.enc.Utf8);
  return JSON.parse(text) as T;
}

function hmacSha256Hex(message: string): string {
  return CryptoJS.HmacSHA256(message, HMAC_KEY).toString(CryptoJS.enc.Hex);
}

async function getAccessToken(): Promise<string> {
  const url = "https://delhigw.napix.gov.in/nic/ecourts/oauth2/token";
  const body = "scope=napix&grant_type=client_credentials";
  const res = await axios.post(url, body, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic OTlhOTcwMmE5MTJlOTVmMzJlM2JkZmIxNWJjNDM1ZTA6NDliNjg5NTMwMzJjMmUwY2RkYWFlMWUxYzJkOTE1Yjg=",
    },
    timeout: 8000,
  });
  return res.data?.access_token as string;
}

export type HighCourtSearchParams = {
  est_code: string; // JKHC01 or JKHC02
  case_type: string; // e.g. "72"
  reg_year: string; // e.g. "2024"
  reg_no: string; // e.g. "123"
};

export type HighCourtCnrParams = {
  cino: string; // CNR (Case Number Registry) Number
};

async function callSearchApi(
  accessToken: string,
  params: HighCourtSearchParams
) {
  const inputStr = `est_code='${params.est_code}'|case_type='${params.case_type}'|reg_year='${params.reg_year}'|reg_no='${params.reg_no}'`;
  const request_token = hmacSha256Hex(inputStr);
  const request_str = aesEncryptBase64(inputStr);
  const url = `https://delhigw.napix.gov.in/nic/ecourts/hc-case-search-api?dept_id=${DEPT_ID}&request_str=${encodeURIComponent(
    request_str
  )}&request_token=${encodeURIComponent(request_token)}&version=v1.0`;
  const res = await axios.get(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    timeout: 8000,
  });
  const b64 = res.data?.response_str as string;
  return aesDecryptBase64ToJson<any>(b64);
}

async function callCnrApi(accessToken: string, cino: string) {
  const inputStr = `cino='${cino}'`;
  const request_token = hmacSha256Hex(inputStr);
  const request_str = aesEncryptBase64(inputStr);
  const url = `https://delhigw.napix.gov.in/nic/ecourts/hc-cnr-api?dept_id=${DEPT_ID}&request_str=${encodeURIComponent(
    request_str
  )}&request_token=${encodeURIComponent(request_token)}&version=v1.0`;
  const res = await axios.get(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    timeout: 8000,
  });
  const b64 = res.data?.response_str as string;
  return aesDecryptBase64ToJson<any>(b64);
}

export const highCourtApi = {
  async getCaseDetails(params: HighCourtSearchParams) {
    const token = await getAccessToken();
    const search = await callSearchApi(token, params);
    // Expecting search.casenos map; pick first cino
    const casenos = search?.casenos;
    const first = casenos ? (Object.values(casenos)[0] as any) : null;
    const cino = first?.cino as string | undefined;
    if (!cino) {
      return { search, detail: null };
    }
    const detail = await callCnrApi(token, cino);
    return { search, detail };
  },
  async getCnrDetails(params: HighCourtCnrParams) {
    const token = await getAccessToken();
    const inputStr = `cino='${params.cino}'`;
    const request_token = hmacSha256Hex(inputStr);
    const request_str = aesEncryptBase64(inputStr);
    const url = `https://delhigw.napix.gov.in/nic/ecourts/dc-cnr-api/cnr?dept_id=${DEPT_ID}&request_str=${encodeURIComponent(
      request_str
    )}&request_token=${encodeURIComponent(request_token)}&version=v1.0`;
    const res = await axios.get(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      timeout: 8000,
    });

    const b64 = res.data?.response_str as string;
 
    return aesDecryptBase64ToJson<any>(b64);
  },
  async getOrderDownloadUrl(
    cino: string,
    order_no: string,
    order_date: string
  ) {
    const token = await getAccessToken();
    const inputStr = `cino='${cino}'|order_no='${order_no}'|order_date='${order_date}'`;
    const request_token = hmacSha256Hex(inputStr);
    const request_str = aesEncryptBase64(inputStr);
    const url =
      `https://delhigw.napix.gov.in/nic/ecourts/hc-order-api/order?dept_id=${DEPT_ID}` +
      `&request_str=${encodeURIComponent(request_str)}` +
      `&request_token=${encodeURIComponent(request_token)}` +
      `&version=v1.0`;
    const res = await axios.get(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      timeout: 10000,
    });

    const b64 = res.data?.response_str as string;

    const decryptedBase64: string = aesDecryptBase64ToJson<string>(b64);
    return { pdfBase64: decryptedBase64 };
  },
};

export default highCourtApi;
