

const REQUEST_FIELDNAMES = {
    ID : "loginID",
    PASSWORD: "password",
    AUTH_CODE: "authCode",
    EXPIRES_AT : "expiresAt",
} as const


type REQUEST_FIELDNAMES = (typeof REQUEST_FIELDNAMES)[keyof typeof REQUEST_FIELDNAMES]


export {REQUEST_FIELDNAMES}