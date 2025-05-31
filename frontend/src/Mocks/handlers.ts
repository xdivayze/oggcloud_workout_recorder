import { http, HttpResponse } from "msw";
import { REQUEST_FIELDNAMES } from "../Tools/constants";

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
      {
        [REQUEST_FIELDNAMES.AUTH_CODE]: "welcome_to_ogglabs",
        [REQUEST_FIELDNAMES.EXPIRES_AT]: new Date(
          new Date().getTime() + 30 * 60 * 1000
        ),
      },
      { status: 200 }
    );
  }),
];
