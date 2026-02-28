import { BackendMobileApi } from "../api/mobileApi.js";
import { FetchHttpClient } from "../api/httpClient.js";
import { PatientFlowService } from "../flows/patientFlow.js";
import { API_BASE_URL } from "../config/runtime.js";
import { ExpoSecureTokenStore } from "../storage/expoSecureTokenStore.js";

const httpClient = new FetchHttpClient(API_BASE_URL);
const mobileApi = new BackendMobileApi(httpClient);
const tokenStore = new ExpoSecureTokenStore();

export const patientFlow = new PatientFlowService(mobileApi, tokenStore);
export { tokenStore };
