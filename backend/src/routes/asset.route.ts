import { Router } from "express";
import {
  createAssetController,
  deleteAssetController,
  getAllAssetsController,
  getAssetByIdController,
  updateAssetController,
} from "../controllers/asset.controller";

const assetRoutes = Router();

assetRoutes.post("/", createAssetController);
assetRoutes.get("/", getAllAssetsController);
assetRoutes.get("/:id", getAssetByIdController);
assetRoutes.put("/:id", updateAssetController);
assetRoutes.delete("/:id", deleteAssetController);

export default assetRoutes;