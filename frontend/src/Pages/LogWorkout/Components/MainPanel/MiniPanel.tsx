import type { RefObject } from "react";

export default function MiniPanel({
  color,
  placeholderText,
  ref,
  contentEditable = true,
  numeric = false,
}: {
  color: string;
  placeholderText: string;
  ref?: RefObject<HTMLDivElement>;
  contentEditable?: boolean;
  numeric?: boolean;
}) {
  return (
    <div
      className={`h-full w-full ${color} rounded-xl font-inter font-light px-2 pb-1 text-2xl items-center justify-center flex`}
      contentEditable={contentEditable}
      suppressContentEditableWarning
      ref={ref}
      inputMode={numeric ? "numeric" : "text"}
      
    >
      {" "}
      {placeholderText}{" "}
    </div>
  );
}
