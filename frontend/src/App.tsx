import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Pages/Home/Home";
import LogWorkout from "./Pages/Secure/LogWorkout/LogWorkout";
import SecurityContext from "./Pages/Secure/SecurityContext";

function App() {
  return (
    <SecurityContext>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="log-workout" element={<LogWorkout />} />
        </Route>
      </Routes>
    </SecurityContext>
  );
}

export default App;
