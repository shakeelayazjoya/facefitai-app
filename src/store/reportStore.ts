import { create } from 'zustand';
import type { StyleReport } from '@/types/api';
interface ReportState { reports: StyleReport[]; activeReport?: StyleReport; addReport: (report: StyleReport, previewUri?: string) => void; setActiveReport: (report: StyleReport) => void; clear: () => void }
export const useReportStore = create<ReportState>((set) => ({
  reports: [], activeReport: undefined,
  addReport: (report, previewUri) => set((state) => { const next = { ...report, preview_url: previewUri ?? report.preview_url }; return { reports: [next, ...state.reports].slice(0, 12), activeReport: next }; }),
  setActiveReport: (report) => set({ activeReport: report }),
  clear: () => set({ reports: [], activeReport: undefined }),
}));
