import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { renderWithTheme } from "../../../utils/testing-utils/render-with-theme";
import { WarningPanel } from "./warning-panel";

describe("WarningPanel", () => {
  let componentElement;
  const onConfirm = jest.fn();

  beforeEach(() => {
    const { container } = renderWithTheme(
      <WarningPanel title={"Warning"} onConfirm={onConfirm} />
    );
    componentElement = container.firstChild;
  });

  it("Should render", () => {
    const title = screen.getByText("Warning");
    const confirmButton = screen.getByRole("button");
    expect(componentElement).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    userEvent.click(confirmButton);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
