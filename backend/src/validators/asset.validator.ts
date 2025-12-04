import { z } from "zod";
import { AssetCategoryEnum } from "../models/asset.model";

export const assetIdSchema = z.string().trim().min(1);

export const createAssetSchema = z.object({
  name: z.string().min(1, "Nama aset wajib diisi").max(100),
  category: z.nativeEnum(AssetCategoryEnum, {
    errorMap: () => ({ message: "Kategori aset tidak valid" }),
  }),
  amount: z.number().min(0, "Nilai aset tidak boleh negatif"),
  institution: z.string().optional(),
  description: z.string().optional(),
});

export const updateAssetSchema = createAssetSchema.partial();

export type CreateAssetType = z.infer<typeof createAssetSchema>;
export type UpdateAssetType = z.infer<typeof updateAssetSchema>;