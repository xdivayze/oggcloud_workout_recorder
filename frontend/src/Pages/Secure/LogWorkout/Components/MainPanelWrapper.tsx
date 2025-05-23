import { createContext, useRef, type ReactNode, type RefObject } from "react";

export type MainPanelRefContextType = {
  exerciseChooseDivRef: RefObject<HTMLDivElement>;
  setNumberDivRef: RefObject<HTMLDivElement>;
  repWeightRef: RefObject<HTMLDivElement>;
  weightUnitRef: RefObject<HTMLDivElement>;
  repCountRef: RefObject<HTMLDivElement>;
};
export const MainPanelRefContext =
  createContext<MainPanelRefContextType | null>(null);

export default function MainPanelWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const exerciseChooseDivRef = useRef<HTMLDivElement>(
    null
  ) as RefObject<HTMLDivElement>;
  const setNumberDivRef = useRef<HTMLDivElement>(
    null
  ) as RefObject<HTMLDivElement>;

  const repWeightRef = useRef<HTMLDivElement>(
    null
  ) as RefObject<HTMLDivElement>;

  const weightUnitRef = useRef<HTMLDivElement>(
    null
  ) as RefObject<HTMLDivElement>;

  const repCountRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;

  const refStorage: MainPanelRefContextType = {
    exerciseChooseDivRef,
    setNumberDivRef,
    repWeightRef,
    weightUnitRef,
    repCountRef,
  };

  return (
    <MainPanelRefContext.Provider value={refStorage}>
      {children}
    </MainPanelRefContext.Provider>
  );
}
