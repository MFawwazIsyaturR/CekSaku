import { z } from "zod";
import { ReportFrequencyEnum } from "../models/report-setting.model";

export const reportSettingSchema = z.object({
  isEnabled: z.boolean().default(true),
});

export const updateReportSettingSchema = z.object({
  isEnabled: z.boolean().optional(),
  frequency: z.nativeEnum(ReportFrequencyEnum).optional(),
});

export type UpdateReportSettingType = z.infer<typeof updateReportSettingSchema>;