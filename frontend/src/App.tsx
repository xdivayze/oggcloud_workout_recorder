import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Pages/Home/Home";
import LogWorkout from "./Pages/LogWorkout/LogWorkout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="log-workout" element={<LogWorkout />} />
      </Route>
    </Routes>
  );
}

export default App;
