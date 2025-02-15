import { PageId } from "../types";
import {
  convertArcGisSlidesToBookmars,
  checkBookmarksByPageId,
} from "./bookmarks-utils";

jest.mock("@math.gl/proj4", () => ({
  Proj4Projection: jest.fn().mockImplementation(() => ({
    project: jest
      .fn()
      .mockImplementation(() => [
        -122.69174972702332, 45.53565981765491, 358.4342414261773,
      ]),
  })),
}));

jest.mock("@deck.gl/core", () => ({
  WebMercatorViewport: jest.fn().mockImplementation(() => ({
    unproject: jest.fn().mockReturnValue([0, 0, 1234567890]),
  })),
}));

jest.mock("./elevation-utils", () => ({
  getLonLatWithElevationOffset: jest
    .fn()
    .mockImplementation(() => [-122.691749, 45.535659]),
}));

jest.mock("./layer-utils", () => ({
  flattenLayerIds: jest
    .fn()
    .mockImplementation(() => ["first-id", "second-id", "third-id"]),
}));

describe("Bookmarks utils", () => {
  test("Should return empty bookmarks array if no presentation slides", () => {
    const webScene = {};

    const layers = [];

    // @ts-expect-error - should follow types for webscene
    const bookmarks = convertArcGisSlidesToBookmars(webScene, layers);

    expect(bookmarks).toEqual([]);
  });

  test("Should return empty bookmarks array if no visible layers in slide", () => {
    const webScene = {
      presentation: {
        slides: [
          {
            id: "slide-1",
            thumbnail: {
              url: "test-thumbnail-url",
            },
            viewpoint: {
              camera: {},
            },
          },
        ],
      },
    };

    const layers = [];
    // @ts-expect-error - should follow types for webscene
    const bookmarks = convertArcGisSlidesToBookmars(webScene, layers);

    expect(bookmarks).toEqual([]);
  });

  test("Should return empty bookmarks array if no camera in slide", () => {
    const webScene = {
      presentation: {
        slides: [
          {
            id: "slide-1",
            thumbnail: {
              url: "test-thumbnail-url",
            },
            viewpoint: {
              camera: null,
            },
            visibleLayers: [],
          },
        ],
      },
    };

    const layers = [];
    const layersLeftSide = [];
    // @ts-expect-error - should follow types for webscene
    const bookmarks = convertArcGisSlidesToBookmars(
      webScene,
      layers,
      layersLeftSide
    );

    expect(bookmarks).toEqual([]);
  });

  test("Should return empty bookmarks array if it has no pseudo-mercator-crs", () => {
    const webScene = {
      presentation: {
        slides: [
          {
            id: "slide-1",
            thumbnail: {
              url: "test-thumbnail-url",
            },
            visibleLayers: [],
            viewpoint: {
              camera: {
                heading: 100,
                tilt: 30,
                position: {
                  x: -13657983.104147997,
                  y: 5706248.07426214,
                  z: 100,
                  spatialReference: {
                    latestWkid: 4326,
                    wkid: 4326,
                  },
                },
              },
            },
          },
        ],
      },
    };

    const layers = [];
    const layersLeftSide = [];
    // @ts-expect-error - should follow types for webscene
    const bookmarks = convertArcGisSlidesToBookmars(
      webScene,
      layers,
      layersLeftSide
    );

    expect(bookmarks).toEqual([]);
  });

  test("Should return empty bookmarks array if it has tilt more than 60", () => {
    const webScene = {
      presentation: {
        slides: [
          {
            id: "slide-1",
            thumbnail: {
              url: "test-thumbnail-url",
            },
            visibleLayers: [],
            viewpoint: {
              camera: {
                heading: 100,
                tilt: 120,
                position: {
                  x: -13657983.104147997,
                  y: 5706248.07426214,
                  z: 100,
                  spatialReference: {
                    latestWkid: 3857,
                    wkid: 102100,
                  },
                },
              },
            },
          },
        ],
      },
    };

    const layers = [];
    const layersLeftSide = [];
    // @ts-expect-error - should follow types for webscene
    const bookmarks = convertArcGisSlidesToBookmars(
      webScene,
      layers,
      layersLeftSide
    );

    expect(bookmarks).toEqual([]);
  });

  test("Should return bookmarks array", () => {
    const webScene = {
      presentation: {
        slides: [
          {
            id: "slide-1",
            thumbnail: {
              url: "test-thumbnail-url",
            },
            visibleLayers: [
              {
                id: "first-id",
              },
              {
                id: "second-id",
              },
              {
                id: "third-id",
              },
            ],
            viewpoint: {
              camera: {
                heading: 100,
                tilt: 60,
                position: {
                  x: -13657983.104147997,
                  y: 5706248.07426214,
                  z: 100,
                  spatialReference: {
                    latestWkid: 3857,
                    wkid: 102100,
                  },
                },
              },
            },
          },
        ],
      },
    };

    const expectedBookmarks = [
      {
        activeLayersIdsLeftSide: ["first-id", "second-id", "third-id"],
        activeLayersIdsRightSide: [],
        id: "slide-1",
        imageUrl: "test-thumbnail-url",
        layersLeftSide: [
          {
            id: "layer-left-side-id",
            type: "I3S",
            name: "layerLeftSide",
            url: "test-url",
          },
        ],
        layersRightSide: [],
        viewState: {
          main: {
            bearing: 100,
            latitude: 45.535659,
            longitude: -122.691749,
            pitch: 60,
            zoom: 21.715794372519387,
          },
          minimap: {
            bearing: 0,
            latitude: 45.535659,
            longitude: -122.691749,
            pitch: 0,
            zoom: 9,
          },
        },
      },
    ];

    const layers = [];
    const layersLeftSide = [
      {
        id: "layer-left-side-id",
        type: "I3S",
        name: "layerLeftSide",
        url: "test-url",
      },
    ];
    // @ts-expect-error - should follow types for webscene
    const bookmarks = convertArcGisSlidesToBookmars(
      webScene,
      layers,
      layersLeftSide
    );

    expect(bookmarks).toEqual(expectedBookmarks);
  });

  test("Should return the same bookmarks page id if all bookmars mached current page id", () => {
    const bookmarks = [
      { id: 1, pageId: PageId.comparison },
      { id: 2, pageId: PageId.comparison },
    ];

    const bookmarksPageId = checkBookmarksByPageId(
      // @ts-expect-error - should follow types for webscene
      bookmarks,
      PageId.comparison
    );

    expect(bookmarksPageId).toEqual(PageId.comparison);
  });

  test("Should return bookmarks page id if all bookmars are not mached with current page id", () => {
    const bookmarks = [
      { id: 1, pageId: PageId.debug },
      { id: 2, pageId: PageId.debug },
    ];

    const bookmarksPageId = checkBookmarksByPageId(
      // @ts-expect-error - should follow types for webscene
      bookmarks,
      PageId.comparison
    );

    expect(bookmarksPageId).toEqual(PageId.debug);
  });
});
