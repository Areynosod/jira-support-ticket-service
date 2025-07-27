export interface FeedbackData {
  full_name: string;
  email: string;
  description: string;
  type: "Question" | "Feedback" | "Feature Request" | "Bug";
  error?: string;
}
