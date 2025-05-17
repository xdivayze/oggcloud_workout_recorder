import type { RefObject } from "react";

export default function MiniPanel({
  height: width,
  color,
  placeholderText,
  ref,
}: {
  height: number;
  color: string;
  placeholderText: string;
  ref: RefObject<HTMLDivElement>;
}) {
  return (
    <div
      className={`min-w-[${width}] h-11 ${color} rounded-lg font-inter font-light `}
      contentEditable
      suppressContentEditableWarning
      ref={ref}
    >
      {" "}
      {placeholderText}{" "}
    </div>
  );
}
