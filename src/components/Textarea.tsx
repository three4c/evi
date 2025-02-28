import React, { useEffect, useRef, useState } from "react";
import * as stylex from "@stylexjs/stylex";

const HEIGHT = 16;

const styles = stylex.create({
  editor: (width: number, height: number) => ({
    border: "1px solid #000",
    width,
    height,
    lineHeight: 1,
    fontSize: HEIGHT,
  }),
  lineWrapper: {
    display: "flex",
    flexDirection: "column",
    width: `${HEIGHT}px`,
  },
  line: {
    display: "inline-block",
  },
});

interface TextareaProps {
  width: number;
  height: number;
}

export const Textarea: React.FC<TextareaProps> = (props) => {
  const [length, setLength] = useState(0);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!divRef.current) {
      return;
    }

    let sumHeight = HEIGHT;
    let sumLength = 0;

    while (sumHeight < divRef.current.clientHeight) {
      sumHeight += HEIGHT;
      sumLength++;
    }

    setLength(sumLength);
  }, []);

  return (
    <div
      {...stylex.props(styles.editor(props.width, props.height))}
      ref={divRef}
    >
      <div {...stylex.props(styles.lineWrapper)}>
        {[...Array(length)].map((_, index) => (
          <span {...stylex.props(styles.line)} key={index}>
            ~
          </span>
        ))}
      </div>
    </div>
  );
};
