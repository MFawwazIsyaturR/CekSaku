import AssetModel from "../models/asset.model";
import { NotFoundException } from "../utils/app-error";
import { CreateAssetType, UpdateAssetType } from "../validators/asset.validator";

export const createAssetService = async (userId: string, body: CreateAssetType) => {
  const asset = await AssetModel.create({
    ...body,
    userId,
  });
  return asset;
};

export const getAllAssetsService = async (userId: string) => {
  const assets = await AssetModel.find({ userId }).sort({ createdAt: -1 });
  
  // Hitung total kekayaan di backend (opsional, tapi berguna)
  const totalNetWorth = assets.reduce((sum, asset) => sum + asset.amount, 0);

  return {
    assets,
    totalNetWorth
  };
};

export const getAssetByIdService = async (userId: string, assetId: string) => {
  const asset = await AssetModel.findOne({ _id: assetId, userId });
  if (!asset) throw new NotFoundException("Asset not found");
  return asset;
};

export const updateAssetService = async (
  userId: string,
  assetId: string,
  body: UpdateAssetType
) => {
  const asset = await AssetModel.findOneAndUpdate(
    { _id: assetId, userId },
    body,
    { new: true }
  );

  if (!asset) throw new NotFoundException("Asset not found");
  return asset;
};

export const deleteAssetService = async (userId: string, assetId: string) => {
  const deleted = await AssetModel.findOneAndDelete({ _id: assetId, userId });
  if (!deleted) throw new NotFoundException("Asset not found");
  return;
};