import { projectsKeys } from "private";
import z from "zod";

export const projectSchema = z.object({
  project: z.enum(projectsKeys),
});

export type ProjectType = z.infer<typeof projectSchema>;
