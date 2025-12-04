import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import {
  createAssetService,
  deleteAssetService,
  getAllAssetsService,
  getAssetByIdService,
  updateAssetService,
} from "../services/asset.service";
import {
  assetIdSchema,
  createAssetSchema,
  updateAssetSchema,
} from "../validators/asset.validator";

export const createAssetController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const body = createAssetSchema.parse(req.body);

    const asset = await createAssetService(userId, body);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Asset created successfully",
      data: asset,
    });
  }
);

export const getAllAssetsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const data = await getAllAssetsService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Assets fetched successfully",
      data,
    });
  }
);

export const getAssetByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const assetId = assetIdSchema.parse(req.params.id);

    const asset = await getAssetByIdService(userId, assetId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Asset details fetched successfully",
      data: asset,
    });
  }
);

export const updateAssetController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const assetId = assetIdSchema.parse(req.params.id);
    const body = updateAssetSchema.parse(req.body);

    const asset = await updateAssetService(userId, assetId, body);

    return res.status(HTTPSTATUS.OK).json({
      message: "Asset updated successfully",
      data: asset,
    });
  }
);

export const deleteAssetController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const assetId = assetIdSchema.parse(req.params.id);

    await deleteAssetService(userId, assetId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Asset deleted successfully",
    });
  }
);