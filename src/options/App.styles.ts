import * as styleX from "@stylexjs/stylex";

const styles = styleX.create({
  container: {
    padding: 20,
    fontFamily: "system-ui",
    fontSize: 14,
  },
  section: {
    marginBottom: 20,
  },
  subtitle: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  inputGroup: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  input: {
    padding: "6px 12px",
    border: "1px solid #ccc",
    borderRadius: 4,
    minWidth: 150,
    backgroundColor: "#fff",
  },
  inputEditing: {
    backgroundColor: "#f0f8ff",
  },
  button: {
    padding: "6px 12px",
    border: "1px solid #ccc",
    borderRadius: 4,
    backgroundColor: "#fff",
    cursor: "pointer",
  },
  message: {
    padding: 10,
    borderRadius: 4,
  },
  messageError: {
    backgroundColor: "#ffebee",
    border: "1px solid #ffcdd2",
    color: "#c62828",
  },
  messageSuccess: {
    backgroundColor: "#e8f5e8",
    border: "1px solid #c8e6c9",
    color: "#2e7d32",
  },
});

export { styleX, styles };
