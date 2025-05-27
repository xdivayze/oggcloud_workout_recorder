const Units = {
    KG : "kg",
    LB: "lb"

} as const;

const REQUEST_FIELDNAMES = {
    ID : "id",
    PASSWORD: "password",
    AUTH_CODE: "authCode",
    EXPIRES_AT : "expiresAt",
} as const

type Unit = (typeof Units)[keyof typeof Units];
type REQUEST_FIELDNAMES = (typeof REQUEST_FIELDNAMES)[keyof typeof REQUEST_FIELDNAMES]

export type {Unit}

export {REQUEST_FIELDNAMES}