export interface HeKaZiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}
