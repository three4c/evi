import { useEffect } from "react";
import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  div: {
    width: 48,
    height: 48,
  },
});

const App: React.FC = () => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      console.log(e.key);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return <div {...stylex.props(styles.div)}>🦐</div>;
};

export default App;
