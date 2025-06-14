import { http, HttpResponse } from "msw";
import { LogWorkoutRequestSchema } from "../../Pages/Secure/LogWorkout/Components/MainPanel/types";
import { REQUEST_FIELDNAMES } from "../../Tools/constants";

export default function handleLogWorkout() {
  return http.post("/api/protected/log-workout", async ({ request }) => {
    const id = request.headers.get(REQUEST_FIELDNAMES.ID);
    if (!id) {
      return new HttpResponse(null, { status: 401 });
    }

    const authCode = request.headers.get(REQUEST_FIELDNAMES.AUTH_CODE);
    if (!authCode) {
      return new HttpResponse(null, { status: 401 });
    }
    //validate auth from database
    //validate expiry from database

    try {
      const data = await request.json();
      const partialRep = LogWorkoutRequestSchema.parse(data);
      partialRep.sets.forEach((v) => {
        console.log(v);
      });
      return new HttpResponse(null, { status: 200 });
    } catch (e) {
      console.error(e);
      return new HttpResponse(null, { status: 400 });
    }
  });
}
