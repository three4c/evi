import { useEffect } from "react";
import { initVim } from "../content";
import "./App.scss";

const App: React.FC = () => {
  const isDev = import.meta.env.DEV;

  const openShortcutSettings = () => chrome.runtime.openOptionsPage();
  const testString = "aaaaa\nbbbbb\nccccc";

  useEffect(() => {
    if (isDev) initVim();
  }, []);

  return isDev ? (
    <div className="App App--dev">
      <p className="App__text">Vite Dev Mode</p>
      <input className="App__child" type="text" />
      <textarea className="App__child" defaultValue={testString} />
      <button
        type="button"
        className="App__child App__button"
        onClick={openShortcutSettings}
      >
        キーボードショートカット設定
      </button>
    </div>
  ) : (
    <div className="App">
      <span className="App__icon">🦐</span>
      <p className="App__text">evi</p>
      <button
        type="button"
        className="App__settings"
        onClick={openShortcutSettings}
      >
        ⚙️
      </button>
    </div>
  );
};

export default App;
