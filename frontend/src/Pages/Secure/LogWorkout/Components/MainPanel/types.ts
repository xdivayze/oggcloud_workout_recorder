import z from "zod";
export const UnitSchema = z.union([z.literal("kg"), z.literal("lb")]);
export type ZUnitType = z.infer<typeof UnitSchema>;
export const PartialRepSchema = z.object({
  setNo: z.number(),
  repCount: z.number(),
  exerciseName: z.string(),
  weight: z.number(),
  unit: UnitSchema,
});

export const PartialRepArraySchema = z.object({
  partialSummaries: z.array(PartialRepSchema),
});

export type PartialRepArrayType = z.infer<typeof PartialRepArraySchema>;
export type PartialRepObjectType = z.infer<typeof PartialRepSchema>;
