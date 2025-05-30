import { createHash } from "crypto";
import { REQUEST_FIELDNAMES } from "../../../../Tools/constants";
import { authContext } from "../../SecurityContext";
import { useContext } from "react";

async function doLoginImpl(id: string, password: string) {
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

export function DoLogin({id, password}: { id: string, password: string}) {
  doLoginImpl(id, password)
    .catch((e: Error) => {
      if (e) {
        console.error(e)
        throw e;
      }
    })
    .then((val) => {
      console.log(val);
      const context = useContext(authContext);
      if (!context) {
        throw "function is not within a context provider";
      }
      if (!val) {
        throw "val does not exist";
      }
      context.login(
        val[REQUEST_FIELDNAMES.AUTH_CODE],
        val[REQUEST_FIELDNAMES.EXPIRES_AT]
      );
      console.log(context.authCode);
    });
  return <></>;
}
