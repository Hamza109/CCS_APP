import axios from "axios";
import * as CryptoJS from "crypto-js";

// Constants taken from the PHP implementation
const AUTHENTICATION_KEY = "sHtqzV8DP88en0jc"; // also used as IV in PHP
const IV = "sHtqzV8DP88en0jc";
const HMAC_KEY = "15081947";
const DEPT_ID = "achalsethi1972%40ecourts.gov.in";

/* ===================== CRYPTO ===================== */

function aesEncryptBase64(plain: string): string {
  const key = CryptoJS.enc.Utf8.parse(AUTHENTICATION_KEY);
  const iv = CryptoJS.enc.Utf8.parse(IV);

  const encrypted = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(plain),
    key,
    {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  return encrypted.toString(); // Base64
}

function aesDecryptBase64ToJson<T = any>(b64Cipher: string): T {
  const key = CryptoJS.enc.Utf8.parse(AUTHENTICATION_KEY);
  const iv = CryptoJS.enc.Utf8.parse(IV);

  const decrypted = CryptoJS.AES.decrypt(b64Cipher, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return JSON.parse(
    decrypted.toString(CryptoJS.enc.Utf8)
  ) as T;
}

function hmacSha256Hex(message: string): string {
  return CryptoJS.HmacSHA256(message, HMAC_KEY).toString(
    CryptoJS.enc.Hex
  );
}

/* ===================== AUTH ===================== */

async function getAccessToken(): Promise<string> {
  const url =
    "https://delhigw.napix.gov.in/nic/ecourts/oauth2/token";

  const body = "scope=napix&grant_type=client_credentials";

  const res = await axios.post(url, body, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic OTlhOTcwMmE5MTJlOTVmMzJlM2JkZmIxNWJjNDM1ZTA6NDliNjg5NTMwMzJjMmUwY2RkYWFlMWUxYzJkOTE1Yjg=",
    },
    timeout: 8000,
  });

  return res.data.access_token;
}

/* ===================== TYPES ===================== */

export type HighCourtSearchParams = {
  est_code: string;
  case_type: string;
  reg_year: string;
  reg_no: string;
};

export type HighCourtCnrParams = {
  cino: string;
};

/** Act API params (USED for your requirement) */
export type ActParams = {
  est_code: string;
  case_type: string;
  reg_year: string;
  pend_disp: string;
  national_act_code: string;
};

/* ===================== SEARCH HELPERS ===================== */

function buildSearchInputStr(params: HighCourtSearchParams): string {
  return `est_code='${params.est_code}'|case_type='${params.case_type}'|reg_year='${params.reg_year}'|reg_no='${params.reg_no}'`;
}

/* ===================== CASE SEARCH ===================== */

async function callSearchApi(
  accessToken: string,
  params: HighCourtSearchParams
) {
  const inputStr = buildSearchInputStr(params);
  const request_token = hmacSha256Hex(inputStr);
  const request_str = aesEncryptBase64(inputStr);

  const url =
    `https://delhigw.napix.gov.in/nic/ecourts/hc-case-search-api` +
    `?dept_id=${DEPT_ID}` +
    `&request_str=${encodeURIComponent(request_str)}` +
    `&request_token=${encodeURIComponent(request_token)}` +
    `&version=v1.0`;

  const res = await axios.get(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    timeout: 8000,
  });

  return aesDecryptBase64ToJson<any>(res.data.response_str);
}

/* ===================== CNR API ===================== */

async function callCnrApi(accessToken: string, cino: string) {
  const inputStr = `cino='${cino}'`;
  const request_token = hmacSha256Hex(inputStr);
  const request_str = aesEncryptBase64(inputStr);

  const url =
    `https://delhigw.napix.gov.in/nic/ecourts/hc-cnr-api` +
    `?dept_id=${DEPT_ID}` +
    `&request_str=${encodeURIComponent(request_str)}` +
    `&request_token=${encodeURIComponent(request_token)}` +
    `&version=v1.0`;

  const res = await axios.get(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    timeout: 8000,
  });

  return aesDecryptBase64ToJson<any>(res.data.response_str);
}

/* ===================== ACT API (ONLY ONE USED) ===================== */

const ACT_BASE_URL =
  "https://delhigw.napix.gov.in/nic/ecourts/dc-act-api/act";

function buildActInputStr(params: ActParams): string {
  return (
    `est_code='${params.est_code}'|` +
    `case_type='${params.case_type}'|` +
    `reg_year='${params.reg_year}'|` +
    `pend_disp='${params.pend_disp}'|` +
    `national_act_code='${params.national_act_code}'`
  );
}

async function callActApi(
  accessToken: string,
  params: ActParams
) {
  const inputStr = buildActInputStr(params);
  const request_token = hmacSha256Hex(inputStr);
  const request_str = aesEncryptBase64(inputStr);

  const url =
    `${ACT_BASE_URL}?dept_id=${DEPT_ID}` +
    `&request_str=${encodeURIComponent(request_str)}` +
    `&request_token=${encodeURIComponent(request_token)}` +
    `&version=v1.0`;

  const res = await axios.get(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    timeout: 15000,
  });

  return aesDecryptBase64ToJson<any>(res.data.response_str);
}

/* ===================== EXPORT ===================== */

export const highCourtApi = {
  async getCaseDetails(params: HighCourtSearchParams) {
    const token = await getAccessToken();
    const search = await callSearchApi(token, params);

    const casenos = search?.casenos;
    const first = casenos ? Object.values(casenos)[0] as any : null;
    const cino = first?.cino;

    if (!cino) {
      return { search, detail: null };
    }

    const detail = await callCnrApi(token, cino);
    return { search, detail };
  },

  async getCnrDetails(params: HighCourtCnrParams) {
    const token = await getAccessToken();
    return callCnrApi(token, params.cino);
  },

  /** ✅ Act API (used with your params) */
  async getAct(params: ActParams) {
    const token = await getAccessToken();
    return callActApi(token, params);
  },

  /**
   * Download order PDF for a given case/order.
   * NOTE: Backend download integration is not wired yet, so this
   * returns an empty payload to keep the UI and types happy.
   */
  async getOrderDownloadUrl(
    _cino: string,
    _orderNo: string,
    _orderDate: string
  ): Promise<{ pdfBase64: string | null }> {
    console.warn(
      "highCourtApi.getOrderDownloadUrl is not yet implemented on the backend.",
      { _cino, _orderNo, _orderDate }
    );
    return { pdfBase64: null };
  },
};

export default highCourtApi;
