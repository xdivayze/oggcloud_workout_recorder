import {
  useContext,
} from "react";
import SetPartialSummary from "./SetPartialSummary";
import {
  MainPanelRefContext,
  type MainPanelRefContextType,
} from "../MainPanelWrapper";
import type { Unit } from "../../../../../Tools/constants";

export function GeneratePartialSummary() {
  const {
    exerciseChooseDivRef,
    setNumberDivRef,
    repWeightRef,
    weightUnitRef,
    repCountRef,
  } = useContext(MainPanelRefContext) as MainPanelRefContextType;

  return (
    <SetPartialSummary
      repCount={repCountRef.current.innerHTML.trim()}
      weight={Number(repWeightRef.current.innerHTML.trim())}
      unit={weightUnitRef.current.innerHTML.trim() as Unit}
      exerciseName={exerciseChooseDivRef.current.innerHTML.trim()}
    />
  );
}

