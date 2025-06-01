import { http, HttpResponse } from "msw";
import { REQUEST_FIELDNAMES } from "../Tools/constants";
import { PartialRepArraySchema } from "../Pages/Secure/LogWorkout/Components/MainPanel/types";

interface ILogin {
  [REQUEST_FIELDNAMES.ID]: string;
  [REQUEST_FIELDNAMES.PASSWORD]: string;
}



export const handlers = [
  http.post("/api/user/login", async ({ request }) => {
    const data = (await request.json()) as ILogin;
    if (!data) {
      return HttpResponse.json({ status: 400 });
    }
    const id = data[REQUEST_FIELDNAMES.ID];
    const password = data[REQUEST_FIELDNAMES.PASSWORD] as string;
    if (!(id && password)) {
      return HttpResponse.json({ success: false }, { status: 401 });
    }

    return HttpResponse.json(
      //TODO switch auth response to headers
      {
        [REQUEST_FIELDNAMES.AUTH_CODE]: "welcome_to_ogglabs",
        [REQUEST_FIELDNAMES.EXPIRES_AT]: new Date(
          new Date().getTime() + 30 * 60 * 1000
        ),
      },
      { status: 200 }
    );
  }),
  http.post("/api/user/log-workout", async ({ request }) => {
    const authCode = request.headers.get(REQUEST_FIELDNAMES.AUTH_CODE);
    if (!authCode) {
      return new HttpResponse({ status: 401 });
    }
    //validate auth from database
    const expiresAt = request.headers.get(REQUEST_FIELDNAMES.EXPIRES_AT);
    if (!expiresAt || new Date(Date.parse(expiresAt)) < new Date()) {
      return new HttpResponse({ status: 401 });
    }

    const data = await request.json();
    try {
      const partialRep = PartialRepArraySchema.parse(data);
      partialRep.partialSummaries.forEach((v) => {
        console.log(v);
      });
    } catch (e) {
      console.error(e);
      return new HttpResponse({ status: 400 });
    }

    return new HttpResponse({ status: 200 });
  }),
];
