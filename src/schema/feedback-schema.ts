import z from "zod";
export const feedbackSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.email("Invalid email"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["Question", "Feedback", "Feature Request", "Bug"], {
    message: "Type is required",
  }),
  priority: z
    .enum(["Lowest", "Low", "Medium", "Highest"], {
      message: "Priority is required",
    })
    .optional(),
});

export type FeedbackType = z.infer<typeof feedbackSchema>;
