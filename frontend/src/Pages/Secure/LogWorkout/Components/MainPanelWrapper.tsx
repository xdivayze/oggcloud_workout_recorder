import { createContext, useRef, type ReactNode, type RefObject } from "react";

export type MainPanelRefContextType = {
  setNumberDivRef: RefObject<HTMLDivElement>;
  repWeightRef: RefObject<HTMLDivElement>;
  weightUnitRef: RefObject<HTMLDivElement>;
  repCountRef: RefObject<HTMLDivElement>;
  chosenExerciseRef: RefObject<HTMLDivElement>;
};
export const MainPanelRefContext =
  createContext<MainPanelRefContextType | null>(null);

export default function MainPanelWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const chosenExerciseRef = useRef<HTMLDivElement>(
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
    setNumberDivRef,
    repWeightRef,
    weightUnitRef,
    repCountRef,
    chosenExerciseRef,
  };

  return (
    <MainPanelRefContext.Provider value={refStorage}>
      {children}
    </MainPanelRefContext.Provider>
  );
}
