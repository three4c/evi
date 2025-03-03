import React, { useEffect, useState } from "react";
import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  editor: (
    fontSize: number,
    top: number,
    left: number,
    width: number,
    height: number,
  ) => ({
    border: "1px solid #000",
    lineHeight: 1,
    fontSize,
    position: "fixed",
    top,
    left,
    width,
    height,
  }),
  lineWrapper: (width: number) => ({
    display: "flex",
    flexDirection: "column",
    width,
  }),
  line: {
    display: "inline-block",
  },
});

interface TextareaProps {
  top: number;
  left: number;
  width: number;
  height: number;
  fontSize: number;
}

export const Textarea: React.FC<TextareaProps> = (props) => {
  const [length, setLength] = useState(0);

  useEffect(() => {
    let sumHeight = props.fontSize;
    let sumLength = 0;

    while (sumHeight < props.height) {
      sumHeight += props.fontSize;
      sumLength++;
    }

    setLength(sumLength);
  }, [props.height, props.fontSize]);

  return (
    <div
      {...stylex.props(
        styles.editor(
          props.fontSize,
          props.top,
          props.left,
          props.width,
          props.height,
        ),
      )}
    >
      <div {...stylex.props(styles.lineWrapper(props.fontSize))}>
        {[...Array(length)].map((_, index) => (
          <span {...stylex.props(styles.line)} key={index}>
            ~
          </span>
        ))}
      </div>
    </div>
  );
};
