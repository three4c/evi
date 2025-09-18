import Content from "../content/App";

import { styleX, styles } from "./App.styles";

const App: React.FC = () => {
  const isDev = import.meta.env.DEV;

  const openShortcutSettings = () => chrome.runtime.openOptionsPage();
  const testString = "aaaaa\nbbbbb\nccccc";

  return isDev ? (
    <div {...styleX.props(styles.dev)}>
      <Content />
      <p>Vite Dev Mode</p>
      <input {...styleX.props(styles.child)} type="text" />
      <textarea {...styleX.props(styles.child)} defaultValue={testString} />
      <button {...styleX.props(styles.child)} onClick={openShortcutSettings}>
        キーボードショートカット設定
      </button>
    </div>
  ) : (
    <div {...styleX.props(styles.div)}>
      <span {...styleX.props(styles.span)}>🦐</span>
      <p {...styleX.props(styles.p)}>evi</p>
      <button {...styleX.props(styles.settings)} onClick={openShortcutSettings}>
        ⚙️
      </button>
    </div>
  );
};

export default App;
