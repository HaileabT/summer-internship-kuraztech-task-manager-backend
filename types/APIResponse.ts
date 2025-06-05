export interface APIResponse {
  status: "success" | "error";
  result?: number;
  message?: string;
  data?: any;
}
