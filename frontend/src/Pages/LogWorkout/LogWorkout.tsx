import MainPanel from "./Components/MainPanel/MainPanel";
import MainPanelWrapper from "./Components/MainPanelWrapper";

export default function LogWorkout() {
  return (
    <div className=" flex-grow m-2">
      <MainPanelWrapper>
              <MainPanel />
            </MainPanelWrapper>
    </div>
  );
}
