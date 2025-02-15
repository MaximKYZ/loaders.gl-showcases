import { TilesetType } from "../types";
import {
  getTilesetType,
  parseTilesetFromUrl,
  parseTilesetUrlParams,
} from "./url-utils";

const mockResponse = jest.fn();

describe("Url Utils - parseTilesetUrlFromUrl", () => {
  test("Should parse tileset url", () => {
    Object.defineProperty(window, "location", {
      value: {
        hash: {
          endsWith: mockResponse,
          includes: mockResponse,
        },
        assign: mockResponse,
        href: "https://test.com?tileset=https://tileset-url.com",
      },
      writable: true,
    });
    const result = parseTilesetFromUrl();
    expect(result).toStrictEqual("https://tileset-url.com");
  });

  test("Should parse url without tileset", () => {
    Object.defineProperty(window, "location", {
      value: {
        hash: {
          endsWith: mockResponse,
          includes: mockResponse,
        },
        assign: mockResponse,
        href: "https://test.com",
      },
      writable: true,
    });
    const result = parseTilesetFromUrl();
    expect(result).toBe("");
  });
});

describe("Url Utils - parseTilesetUrlParams", () => {
  test("Should parse tileset params", () => {
    const url = "https://tileset-url.com/layers/0";
    const options = null;
    const result = parseTilesetUrlParams(url, options);
    expect(result).toStrictEqual({
      metadataUrl: "https://tileset-url.com",
      tilesetUrl: "https://tileset-url.com/layers/0",
      token: null,
    });
  });

  test("Should parse tileset params with token in options", () => {
    const url = "https://tileset-url.com/layers/0";
    const options = {
      token: "test_token",
    };
    const result = parseTilesetUrlParams(url, options);
    expect(result).toStrictEqual({
      metadataUrl: "https://tileset-url.com",
      tilesetUrl: "https://tileset-url.com/layers/0",
      token: "test_token",
    });
  });

  test("Should parse tileset params with token in options and search", () => {
    const url = "https://tileset-url.com/layers/0?token=test_token";
    const options = {};
    const result = parseTilesetUrlParams(url, options);
    expect(result).toStrictEqual({
      metadataUrl: "https://tileset-url.com?token=test_token",
      tilesetUrl: "https://tileset-url.com/layers/0?token=test_token",
      token: "test_token",
    });
  });

  test("Should replace tileset url with layers/0", () => {
    const url = "https://tileset-url.com";
    const options = null;
    const result = parseTilesetUrlParams(url, options);
    expect(result).toStrictEqual({
      metadataUrl: "https://tileset-url.com",
      tilesetUrl: "https://tileset-url.com/layers/0",
      token: null,
    });
  });

  test("Should parse with type 'I3S'", () => {
    const url = "https://tileset-url.com/layers/0";
    const options = { type: TilesetType.I3S };
    const result = parseTilesetUrlParams(url, options);
    expect(result).toEqual({
      metadataUrl: "https://tileset-url.com",
      tilesetUrl: "https://tileset-url.com/layers/0",
      type: TilesetType.I3S,
    });
  });

  test("Should parse with type 'CesiumIon'", () => {
    const url = "https://tileset-url.com/tileset.json";
    const options = { type: TilesetType.CesiumIon };
    const result = parseTilesetUrlParams(url, options);
    expect(result).toEqual({
      metadataUrl: "",
      tilesetUrl: "https://tileset-url.com/tileset.json",
      type: TilesetType.CesiumIon,
    });
  });
});

describe("Url Utils - getTilesetType", () => {
  test("Should get tileset type by url", () => {
    const result = getTilesetType(
      "https://assets.ion.cesium.com/1234556/tileset.json"
    );
    expect(result).toEqual(TilesetType.CesiumIon);
  });

  test("Should return 3DTiles type", () => {
    const result = getTilesetType("https://path.to.the/web/site/data.json");
    expect(result).toEqual(TilesetType.Tiles3D);
  });

  test("Should return I3S type", () => {
    const result = getTilesetType(
      "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_3DObjects_1_7/SceneServer/layers/0"
    );
    expect(result).toEqual(TilesetType.I3S);

    const resultEmptyUrl = getTilesetType();
    expect(resultEmptyUrl).toEqual(TilesetType.I3S);
  });
});
