import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ButtonSize } from "../../types";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { PlusButton } from "./plus-button";

const onClickMock = jest.fn();

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <PlusButton
      buttonSize={ButtonSize.Small}
      onClick={onClickMock}
      {...props} />
  );
};

describe("Plus Button", () => {
  it("Should render small Plus button", () => {
    const { container } = callRender(renderWithTheme, { children: 'Test Button' });
    expect(container).toBeInTheDocument();
    const button = screen.getByText('Test Button');
    const buttonHeight = getComputedStyle(button.previousSibling as Element).getPropertyValue(
      "height"
    );
    expect(buttonHeight).toEqual('24px');
    userEvent.click(button);
    expect(onClickMock).toHaveBeenCalled();
  });

  it("Should render Big Plus button", () => {
    const { container } = callRender(renderWithTheme, { children: 'Test Button', buttonSize: ButtonSize.Big });
    expect(container).toBeInTheDocument();
    const button = screen.getByText('Test Button');
    const buttonHeight = getComputedStyle(button.previousSibling as Element).getPropertyValue(
      "height"
    );
    expect(buttonHeight).toEqual('40px');
    userEvent.click(button);
    expect(onClickMock).toHaveBeenCalled();
  });
});
