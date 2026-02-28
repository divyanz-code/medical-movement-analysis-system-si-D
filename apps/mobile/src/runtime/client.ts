import { BackendMobileApi } from "../api/mobileApi";
import { FetchHttpClient } from "../api/httpClient";
import { info, warn } from "../debug/logger";
import { PatientFlowService } from "../flows/patientFlow";
import { API_BASE_URL } from "../config/runtime";
import { ExpoSecureTokenStore } from "../storage/expoSecureTokenStore";

info("runtime", "mobile-client-initialized", { apiBaseUrl: API_BASE_URL });
if (API_BASE_URL.includes("localhost")) {
  warn(
    "runtime",
    "API base URL uses localhost. Physical iPhone cannot reach this. Use your Mac LAN IP."
  );
}

const httpClient = new FetchHttpClient(API_BASE_URL);
const mobileApi = new BackendMobileApi(httpClient);
const tokenStore = new ExpoSecureTokenStore();

export const patientFlow = new PatientFlowService(mobileApi, tokenStore);
export { tokenStore };
