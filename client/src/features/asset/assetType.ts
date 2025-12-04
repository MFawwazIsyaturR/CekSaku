export type AssetCategory = "cash" | "investment" | "property" | "crypto";

export interface Asset {
  _id: string;
  userId: string;
  name: string;
  category: AssetCategory;
  amount: number;
  institution?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssetRequest {
  name: string;
  category: AssetCategory;
  amount: number;
  institution?: string;
  description?: string;
}

export interface GetAllAssetsResponse {
  message: string;
  data: {
    assets: Asset[];
    totalNetWorth: number;
  };
}