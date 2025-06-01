import { createHash } from "crypto";
import  { REQUEST_FIELDNAMES } from "../../../Tools/constants";

export async function DoLogin(id: string, password: string) {
  const hashedPassword = createHash("sha256").update(password).digest("hex");

  const body = JSON.stringify({
    [REQUEST_FIELDNAMES.ID]: id,
    [REQUEST_FIELDNAMES.PASSWORD]: hashedPassword,
  });

  const resp = await fetch("/api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  }).catch((e: Error) => {
    throw e;
  });
  if (!resp.ok) {
    throw new Error("request returned non-200 code: " + resp.status);
  }

  const respBody = await resp.json();
  if (!(REQUEST_FIELDNAMES.AUTH_CODE in respBody)) {
    throw new Error(
      REQUEST_FIELDNAMES.AUTH_CODE + " does not exist on response body"
    );
  }
  if (!(REQUEST_FIELDNAMES.EXPIRES_AT in respBody)) {
    throw new Error(
      REQUEST_FIELDNAMES.EXPIRES_AT + " does not exist on response body"
    );
  }

  return {
    [REQUEST_FIELDNAMES.AUTH_CODE]: respBody[
      REQUEST_FIELDNAMES.AUTH_CODE
    ] as string,
    [REQUEST_FIELDNAMES.EXPIRES_AT]: respBody[
      REQUEST_FIELDNAMES.EXPIRES_AT
    ] as Date,
  };
}