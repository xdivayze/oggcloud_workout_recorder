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

  const headers = resp.headers;
  if (!headers) {
    throw new Error("Response headers are null");
  }

  const authCode = headers.get(REQUEST_FIELDNAMES.AUTH_CODE);
  if (!authCode) {
    throw new Error(
      REQUEST_FIELDNAMES.AUTH_CODE + " does not exist on response headers"
    );
  }

  const expiresAt = headers.get(REQUEST_FIELDNAMES.EXPIRES_AT);
  if (!expiresAt) {
    throw new Error(
      REQUEST_FIELDNAMES.EXPIRES_AT + " does not exist on response headers"
    );
  }

  return {
    [REQUEST_FIELDNAMES.AUTH_CODE]: authCode,
    [REQUEST_FIELDNAMES.EXPIRES_AT]: new Date(expiresAt),
  };
}