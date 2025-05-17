import type { RefObject } from "react";

export default function MiniPanel({
  color,
  placeholderText,
  ref,
}: {

  color: string;
  placeholderText: string;
  ref: RefObject<HTMLDivElement> | null;
}) {
  return (
    <div
      className={`h-full w-full ${color} rounded-lg font-inter font-light px-2 pb-1 text-2xl items-center justify-center flex`}
      contentEditable
      suppressContentEditableWarning
      ref={ref}
    >
      {" "}
      {placeholderText}{" "}
    </div>
  );
}
