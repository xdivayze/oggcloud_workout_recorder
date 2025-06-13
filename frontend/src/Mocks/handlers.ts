import handleGetProgress from "./Handlers/handleGetProgress";
import handleLogin from "./Handlers/handleLogin";
import handleLogWorkout from "./Handlers/handleLogWorkout";

export const handlers = [
  handleLogin(),
  handleLogWorkout(),
  handleGetProgress(),
];
