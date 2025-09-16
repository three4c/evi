import * as stylex from "@stylexjs/stylex";

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
    fontWeight: "600",
    fontFamily: "'Rubik', serif",
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
  child: {
    width: "50%",
  },
});

const App: React.FC = () => {
  const isDev = import.meta.env.DEV;
  return isDev ? (
    <div {...stylex.props(styles.dev)}>
      <Content />
      <p>Vite Dev Mode</p>
      <input {...stylex.props(styles.child)} type="text" />
      <textarea {...stylex.props(styles.child)} />
    </div>
  ) : (
    <div {...stylex.props(styles.div)}>
      <span {...stylex.props(styles.span)}>🦐</span>
      <p {...stylex.props(styles.p)}>evi</p>
    </div>
  );
};

export default App;
