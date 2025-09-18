import * as styleX from "@stylexjs/stylex";

const styles = styleX.create({
  div: {
    background:
      "linear-gradient(180deg, rgba(255,175,0,1) 0%, rgba(255,34,101,1) 100%);",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 16px",
    userSelect: "none",
  },
  p: {
    color: "#fff",
    fontWeight: "600",
    fontFamily: "'Rubik', serif",
    fontSize: 16,
    pointerEvents: "none",
  },
  span: {
    marginRight: 8,
    pointerEvents: "none",
  },
  settings: {
    marginLeft: 8,
    padding: 0,
    background: "transparent",
    border: "none",
    ":hover": {
      cursor: "pointer",
      filter: "brightness(0.8)",
    },
  },
  dev: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    width: 300,
    padding: 16,
  },
  child: {
    width: "100%",
  },
});

export { styleX, styles };
