import type { TileValidationData } from "../../types";
import type { Tile3D } from "@loaders.gl/tiles";

import { getBoundingType, createBoundingVolumeFromTile } from "../../bounding-volume";

/**
 * Generates data for tile validation
 * @param tile
 */
export const getTileDataForValidation = (tile: Tile3D): TileValidationData => {
  if (
    !tile.content &&
    !tile.content.attributes &&
    !tile.content.attributes.POSITION
  ) {
    throw new Error("Validator - There are no positions in tile");
  }

  const boundingType = getBoundingType(tile);
  const positions = tile.content.attributes.positions.value;

  const boundingVolume = createBoundingVolumeFromTile(tile);
  return { positions, boundingType, boundingVolume };
};
