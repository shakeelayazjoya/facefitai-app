export type AnalyticsEvent =
  | 'app_opened'
  | 'login_success'
  | 'signup_success'
  | 'logout'
  | 'scan_started'
  | 'scan_completed'
  | 'scan_failed'
  | 'favorite_created'
  | 'report_opened'
  | 'style_edit_started'
  | 'privacy_scan_started';

export interface AnalyticsPayload {
  [key: string]: string | number | boolean | null | undefined;
}

export const analytics = {
  track(event: AnalyticsEvent, payload: AnalyticsPayload = {}): void {
    if (__DEV__) {
      console.log('[analytics]', event, payload);
    }
  },
};
