import styled from "styled-components";
import {
  color_brand_tertiary,
  color_canvas_primary_inverted,
  dim_brand_tertinary,
} from "../../constants/colors";
import GearIcon from "../../../public/icons/gear.svg";
import SettingsIcon from "../../../public/icons/settings.svg";
import MemoryIcon from "../../../public/icons/memory.svg";
import BookmarksIcon from "../../../public/icons/bookmarks.svg";
import DebugIcon from "../../../public/icons/debug.svg";
import ValidatorIcon from "../../../public/icons/validator.svg";
import { ActiveButton, Layout } from "../../types";
import { useAppLayout } from "../../utils/hooks/layout";

type ContainerProps = {
  id: string;
};

const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.colors.mainCanvasColor};
  border-radius: 12px;
  padding: 2px;
`;

type ButtonProps = {
  active: boolean;
  layout: Layout;
};
const Button = styled.button<ButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  width: 56px;
  height: 60px;
  cursor: pointer;
  fill: ${({ theme, active }) =>
    active
      ? color_canvas_primary_inverted
      : theme.colors.mainToolsPanelIconColor};
  background-color: ${({ active }) =>
    active ? color_brand_tertiary : "transparent"};
  outline: 0;
  border: none;

  &:hover {
    fill: ${({ theme, active }) =>
    active
      ? color_canvas_primary_inverted
      : theme.colors.mainToolsPanelDimIconColor};
    background-color: ${({ active }) =>
    active ? dim_brand_tertinary : "transparent"};
  }
`;

type MainToolsPanelProps = {
  id: string;
  activeButton: ActiveButton;
  showLayerOptions?: boolean;
  showComparisonSettings?: boolean;
  showBookmarks?: boolean;
  showDebug?: boolean;
  showValidator?: boolean;
  bookmarksActive?: boolean;
  onChange?: (active: ActiveButton) => void;
  onShowBookmarksChange?: () => void;
};

export const MainToolsPanel = ({
  id,
  activeButton,
  showLayerOptions = true,
  showComparisonSettings = false,
  showBookmarks = false,
  showDebug = false,
  showValidator = false,
  bookmarksActive = false,
  onChange = () => ({}),
  onShowBookmarksChange,
}: MainToolsPanelProps) => {
  const layout = useAppLayout();

  return (
    <Container id={id}>
      {showLayerOptions && (
        <Button
          id={'layers-options-tab'}
          layout={layout}
          active={activeButton === ActiveButton.options}
          onClick={() => onChange(ActiveButton.options)}
        >
          <GearIcon />
        </Button>
      )}
      {showComparisonSettings && (
        <Button
          id={'settings-tab'}
          layout={layout}
          active={activeButton === ActiveButton.settings}
          onClick={() => onChange(ActiveButton.settings)}
        >
          <SettingsIcon />
        </Button>
      )}
      <Button
        id={'memory-usage-tab'}
        layout={layout}
        active={activeButton === ActiveButton.memory}
        onClick={() => onChange(ActiveButton.memory)}
      >
        <MemoryIcon />
      </Button>
      {showValidator && (
        <Button
          id={'validator-tab'}
          layout={layout}
          active={activeButton === ActiveButton.validator}
          onClick={() => onChange(ActiveButton.validator)}
        >
          <ValidatorIcon />
        </Button>
      )}
      {showDebug && (
        <Button
          id={'debug-panel-tab'}
          layout={layout}
          active={activeButton === ActiveButton.debug}
          onClick={() => onChange(ActiveButton.debug)}
        >
          <DebugIcon />
        </Button>
      )}
      {showBookmarks && (
        <Button
          id={'bookmarks-tab'}
          layout={layout}
          active={bookmarksActive}
          onClick={onShowBookmarksChange}
        >
          <BookmarksIcon />
        </Button>
      )}
    </Container>
  );
};
