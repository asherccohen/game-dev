import { Leva, useControls } from 'leva';
import { parseAsBoolean, useQueryState } from 'nuqs';

export const useEditorControls = () => {
  const debugControls = useControls('Debug', {
    showLighting: false,
    showGrid: false,
    showCollisions: false,
    showPhysics: false,
    enableControls: true,
    showHelpers: false,
    showShadows: false,
    showStats: false,
    showCamera: false,
    // refMonitor: monitor(ref, { graph: true, interval: 30 }),
    // lighting: folder({
    // }),
  });

  // const { curve } = useControls({ curve: bezier() });

  return {
    debugControls,
  };
};

export const useBezierControls = () => {
  // const { curve } = useControls({ curve: bezier() });

  return null;
};

export const useDebug = () => {
  const debugStore = useQueryState('debug', parseAsBoolean.withDefault(false));

  return debugStore;
};

export const Editor = ({ debug = false }: { debug?: boolean }) => {
  return (
    <Leva
      // theme={myTheme} // you can pass a custom theme (see the styling section)
      // fill // default = false,  true makes the pane fill the parent dom node it's rendered in
      // flat // default = false,  true removes border radius and shadow
      // oneLineLabels // default = false, alternative layout for labels, with labels and fields on separate rows
      // hideTitleBar // default = false, hides the GUI header
      collapsed // default = false, when true the GUI is collpased
      hidden={!debug} // default = false, when true the GUI is hidden
    />
  );
};
