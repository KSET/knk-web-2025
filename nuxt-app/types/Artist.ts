import type { ImageAsset } from "@sanity/types";

export interface Artist {
  _id: string;
  _type: "artist";
  _createdAt: string;
  name: string;
  description?: string;
  image?: ImageAsset;
}
