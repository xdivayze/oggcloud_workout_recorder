import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Pages/Home/Home";
import LogWorkout from "./Pages/LogWorkout/LogWorkout";
import MainPanelWrapper from "./Pages/LogWorkout/Components/MainPanelWrapper";
import MainPanel from "./Pages/LogWorkout/Components/MainPanel/MainPanel";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route
          path="log-workout"
          element={
            <MainPanelWrapper>
              <MainPanel />
            </MainPanelWrapper>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
