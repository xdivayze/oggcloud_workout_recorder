const Units = {
    KG : "kg",
    LB: "lb"

} as const;

type Unit = (typeof Units)[keyof typeof Units];

export type {Unit}