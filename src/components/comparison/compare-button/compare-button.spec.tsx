import { renderWithTheme } from "../../../utils/testing-utils/render-with-theme";
import { CompareButton } from "./compare-button";
import { CompareButtonMode } from "../../../types";
import userEvent from "@testing-library/user-event";
import { useAppLayout } from "../../../utils/hooks/layout";

jest.mock("../../../utils/hooks/layout");

const useAppLayoutMock = useAppLayout as unknown as jest.Mocked<any>;

const onCompareModeToggle = jest.fn();
const onDownloadClick = jest.fn();

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <CompareButton
      compareButtonMode={CompareButtonMode.Start}
      downloadStats={false}
      disableButton={true}
      disableDownloadButton={false}
      onCompareModeToggle={onCompareModeToggle}
      onDownloadClick={onDownloadClick}
      {...props}
    />
  );
};

describe("CompareButton", () => {
  it("Should render start comparing", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { container, getByText } = callRender(renderWithTheme);
    const buttonContainer = getByText("Start comparing");
    expect(container).toBeInTheDocument();
    expect(buttonContainer).toBeInTheDocument();
    expect(buttonContainer.closest("button")).toBeDisabled();
    expect(container.firstChild.childNodes.length).toBe(1);
  });

  it("Should render comparing", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { getByText } = callRender(renderWithTheme, {
      compareButtonMode: CompareButtonMode.Comparing,
      disableButton: false,
    });
    const buttonContainer = getByText("Stop comparing");
    expect(buttonContainer).toBeInTheDocument();
    expect(buttonContainer.closest("button")).not.toBeDisabled();
  });

  it("Should render download button", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { container } = callRender(renderWithTheme, {
      downloadStats: true,
    });
    expect(container.firstChild.childNodes.length).toBe(2);
  });

  it("Should click download button", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { container } = callRender(renderWithTheme, {
      downloadStats: true,
    });
    const downloadButton = container.firstChild.lastChild;
    userEvent.click(downloadButton);
    expect(onDownloadClick).toHaveBeenCalled();
  });

  it("Should disable download button when comparing is stopped", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { container } = callRender(renderWithTheme, {
      downloadStats: true,
      disableDownloadButton: true,
    });
    const downloadButton = container.firstChild.lastChild;
    expect(downloadButton).toBeDisabled();
  });

  it("Should disable button when tiles are not loaded", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { container } = callRender(renderWithTheme);
    const compareButton = container.firstChild.firstChild;
    expect(compareButton).toBeDisabled();
  });

  it("Should show desktop tooltip when button is disabled", () => {
    useAppLayoutMock.mockImplementation(() => "destop");
    const { container, getByText } = callRender(renderWithTheme, {
      disableButton: true,
    });
    const compareButton = container.firstChild;
    userEvent.hover(compareButton);
    getByText("You can start comparison when all tiles are fully loaded");
    userEvent.unhover(compareButton);
  });

  it("Should show mobile tooltip when button is disabled", () => {
    useAppLayoutMock.mockImplementation(() => "mobile");
    const { container, getByText } = callRender(renderWithTheme);

    const compareButton = container.firstChild.firstChild;
    expect(compareButton).toBeDisabled();
    getByText("You can start comparison when all tiles are fully loaded");
  });
});
