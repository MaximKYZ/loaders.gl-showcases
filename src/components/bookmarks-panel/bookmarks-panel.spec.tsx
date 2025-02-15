import userEvent from "@testing-library/user-event";
import { PageId } from "../../types";
import { useAppLayout } from "../../utils/hooks/layout";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { BookmarksPanel } from "./bookmarks-panel";
import { dragAndDropText } from "./upload-panel";

jest.mock("../../utils/hooks/layout");

const TEST_BOOKMARKS = [
  {
    id: "testId1",
    pageId: PageId.viewer,
    imageUrl: "testUrl",
    layersLeftSide: [],
    layersRightSide: [],
    activeLayersIdsLeftSide: [],
    activeLayersIdsRightSide: [],
    viewState: {},
  },
  {
    id: "testId2",
    pageId: PageId.viewer,
    imageUrl: "testUrl",
    layersLeftSide: [],
    layersRightSide: [],
    activeLayersIdsLeftSide: [],
    activeLayersIdsRightSide: [],
    viewState: {},
  },
  {
    id: "testId3",
    pageId: PageId.viewer,
    imageUrl: "testUrl",
    layersLeftSide: [],
    layersRightSide: [],
    activeLayersIdsLeftSide: [],
    activeLayersIdsRightSide: [],
    viewState: {},
  },
];

const useAppLayoutMock = useAppLayout as unknown as jest.Mocked<any>;

const onSelectBookmark = jest.fn();
const onClose = jest.fn();
const onCollapsed = jest.fn();
const onAddBookmark = jest.fn();
const onClearBookmarks = jest.fn();
const onEditBookmark = jest.fn();
const onDeleteBookmark = jest.fn();
const onDownloadBookmarks = jest.fn();
const onBookmarksUploaded = jest.fn();

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <BookmarksPanel
      id="test-bookmarks"
      bookmarks={TEST_BOOKMARKS}
      disableBookmarksAdding={false}
      onSelectBookmark={onSelectBookmark}
      onClose={onClose}
      onCollapsed={onCollapsed}
      onAddBookmark={onAddBookmark}
      onClearBookmarks={onClearBookmarks}
      onEditBookmark={onEditBookmark}
      onDeleteBookmark={onDeleteBookmark}
      onDownloadBookmarks={onDownloadBookmarks}
      onBookmarksUploaded={onBookmarksUploaded}
      {...props}
    />
  );
};

describe("BookmarksPanel", () => {
  it("Should render bookmarks", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { container } = callRender(renderWithTheme);
    expect(container).toBeInTheDocument();
  });

  it("Should render empty bookmarks panel", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { getByText } = callRender(renderWithTheme, {
      bookmarks: [],
    });
    expect(getByText("Bookmarks list is empty")).toBeInTheDocument();
  });

  it("Should open option menu", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { getAllByRole, getByText } = callRender(renderWithTheme);
    const buttons = getAllByRole("button");
    const optionButton = buttons[buttons.length - 1];
    userEvent.click(optionButton);
    expect(getAllByRole("button")[0]).toHaveStyle("opacity: 1");
    const editOption = getByText("Edit Bookmark");
    userEvent.click(editOption);
    expect(getAllByRole("button")[0]).toHaveStyle("opacity: 0.4");
  });

  it("Should render clear bookmarks dekstop content", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { getAllByRole, getByText } = callRender(renderWithTheme);
    const buttons = getAllByRole("button");
    const optionButton = buttons[buttons.length - 1];
    userEvent.click(optionButton);
    expect(getAllByRole("button").length).toBe(4);
    const clearOption = getByText("Clear bookmarks");
    userEvent.click(clearOption);
    expect(getAllByRole("button").length).toBe(5);
  });

  it("Should cancel clear bookmarks", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { getAllByRole, getByText } = callRender(renderWithTheme);
    const buttons = getAllByRole("button");
    const optionButton = buttons[buttons.length - 1];
    userEvent.click(optionButton);
    const clearOption = getByText("Clear bookmarks");
    userEvent.click(clearOption);
    expect(getAllByRole("button")[0]).toHaveStyle("opacity: 0.4");
    const cancelClear = getAllByRole("button")[4];
    userEvent.click(cancelClear);
    expect(getAllByRole("button")[0]).toHaveStyle("opacity: 1");
  });

  it("Should clear bookmarks", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { getAllByRole, getByText } = callRender(renderWithTheme);
    const buttons = getAllByRole("button");
    const optionButton = buttons[buttons.length - 1];
    userEvent.click(optionButton);
    const clearOption = getByText("Clear bookmarks");
    userEvent.click(clearOption);
    const confirmButton = getAllByRole("button")[3];
    userEvent.click(confirmButton);
    expect(onClearBookmarks).toHaveBeenCalled();
  });

  it("Should render clear bookmarks mobile content", () => {
    useAppLayoutMock.mockImplementation(() => "mobile");
    const { getAllByRole, getByText } = callRender(renderWithTheme);
    const buttons = getAllByRole("button");
    const optionButton = buttons[buttons.length - 1];
    userEvent.click(optionButton);
    const clearOption = getByText("Clear bookmarks");
    userEvent.click(clearOption);
    const body = document.getElementsByTagName("body")[0];
    expect(body.childNodes[1]).toContainHTML(
      "Are you sure you  want to clear all  bookmarks?"
    );
  });

  it("Should render bookmarks unsaved warning content", () => {
    useAppLayoutMock.mockImplementation(() => "mobile");
    const { getAllByRole, getByText } = callRender(renderWithTheme);
    const buttons = getAllByRole("button");
    const optionButton = buttons[buttons.length - 1];
    userEvent.click(optionButton);
    const uploadOption = getByText("Upload bookmarks");
    userEvent.click(uploadOption);
    const body = document.getElementsByTagName("body")[0];
    const popover = body.childNodes[1];
    expect(popover).toContainHTML(
      "You have unsaved bookmarks. After uploading the file, they will be cleared."
    );
  });

  it("Should render bookmarks upload content", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { getAllByRole, getByText } = callRender(renderWithTheme);
    const buttons = getAllByRole("button");
    const optionButton = buttons[buttons.length - 1];
    userEvent.click(optionButton);
    const uploadOption = getByText("Upload bookmarks");
    userEvent.click(uploadOption);
    const body = document.getElementsByTagName("body")[0];
    const popover = body.childNodes[1];
    const uploadButton = getByText("Upload");
    userEvent.click(uploadButton);
    expect(popover).toContainHTML(dragAndDropText);
  });

  it("Should close unsaved content", () => {
    useAppLayoutMock.mockImplementation(() => "mobile");
    const { getAllByRole, getByText } = callRender(renderWithTheme);
    const buttons = getAllByRole("button");
    const optionButton = buttons[buttons.length - 1];
    userEvent.click(optionButton);
    const uploadOption = getByText("Upload bookmarks");
    userEvent.click(uploadOption);
    const body = document.getElementsByTagName("body")[0];
    const popover = body.childNodes[1];
    const cancelButton = getByText("Cancel");
    userEvent.click(cancelButton);
    expect(popover).not.toContainHTML("Cancel");
  });

  it("Should close upload content", () => {
    useAppLayoutMock.mockImplementation(() => "mobile");
    const { getAllByRole, getByText } = callRender(renderWithTheme);
    const buttons = getAllByRole("button");
    const optionButton = buttons[buttons.length - 1];
    userEvent.click(optionButton);
    const uploadOption = getByText("Upload bookmarks");
    userEvent.click(uploadOption);
    const body = document.getElementsByTagName("body")[0];
    const popover = body.childNodes[1];
    const uploadButton = getByText("Upload");
    userEvent.click(uploadButton);
    const cancelButton = getByText("Cancel");
    userEvent.click(cancelButton);
    expect(popover).not.toContainHTML(dragAndDropText);
  });

  it("Should render confirm deleting mobile", () => {
    useAppLayoutMock.mockImplementation(() => "mobile");
    const { getAllByRole, getByText } = callRender(renderWithTheme);
    const buttons = getAllByRole("button");
    const optionButton = buttons[buttons.length - 1];
    userEvent.click(optionButton);
    const clearOption = getByText("Clear bookmarks");
    userEvent.click(clearOption);
    const body = document.getElementsByTagName("body")[0];
    const popover = body.childNodes[1];
    const warning = "Are you sure you  want to clear all  bookmarks?";
    expect(popover).toContainHTML(warning);
    const cancelButton = getByText("No, Keep");
    userEvent.click(cancelButton);
    expect(popover).not.toContainHTML(warning);
  });
});
