import z from "zod";
export const UnitSchema = z.union([z.literal("kg"), z.literal("lb")]);
export type ZUnitType = z.infer<typeof UnitSchema>;
export const WorkoutSetSchema = z.object({
  setNo: z.number(),
  repCount: z.number(),
  exerciseName: z.string(),
  weight: z.number(),
  unit: UnitSchema,
});

export const LogWorkoutRequestSchema = z.object({
  sets: z.array(WorkoutSetSchema),
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format")
    .transform((val) => new Date(val)),
});

export type LogWorkoutRequestType = z.infer<typeof LogWorkoutRequestSchema>;
export type WorkoutSetType = z.infer<typeof WorkoutSetSchema>;
