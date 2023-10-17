import { Document } from "mongoose";

enum AssetType {
  IMAGE = 0,
  VIDEO = 1,
  WEB_EMBED = 2,
  TEXT = 3,
}

enum AssetTheme {
  ALL = -1,
  LIGHT = 0,
  DARK = 1,
}

interface Asset {
  name: string;
  description: string;
  url: string;
  type: AssetType;
  theme: AssetTheme;
  dimensions: {
    width: number;
    height: number;
    unit: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface AssetDocument extends Asset, Document {}

const AssetTypeValues = Object.values(AssetType).filter(
  (value) => typeof value === "number"
);

const AssetThemeValues = Object.values(AssetTheme).filter(
  (value) => typeof value === "number"
);

export {
  Asset,
  AssetDocument,
  AssetType,
  AssetTypeValues,
  AssetTheme,
  AssetThemeValues,
};
