import * as stylex from "@stylexjs/stylex";
import "../reset.css";

import Content from "../content/App";

const styles = stylex.create({
  div: {
    background:
      "linear-gradient(180deg, rgba(255,175,0,1) 0%, rgba(255,34,101,1) 100%);",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 16px",
  },
  p: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "'Noto Sans', serif",
    fontSize: 16,
  },
  span: {
    marginRight: 8,
  },
  dev: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    height: "100vh",
  },
  input: {
    width: "50%",
  },
  textarea: {
    width: "50%",
  },
});

const App: React.FC = () => {
  const isDev = import.meta.env.DEV;
  return isDev ? (
    <div {...stylex.props(styles.dev)}>
      <Content />
      <input {...stylex.props(styles.input)} type="text" />
      <textarea {...stylex.props(styles.textarea)} />
    </div>
  ) : (
    <div {...stylex.props(styles.div)}>
      <span {...stylex.props(styles.span)}>🦐</span>
      <p {...stylex.props(styles.p)}>evi</p>
    </div>
  );
};

export default App;
