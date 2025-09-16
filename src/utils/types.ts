export type FeedbackData = {
  full_name: string;
  email: string;
  description: string;
  type: "Question" | "Feedback" | "Feature Request" | "Bug";
  priority?: "Lowest" | "Low" | "Medium" | "Highest";
  error?: string;
};

export type TurnstileVerifyResponse = {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
  action?: string;
  cdata?: string;
};
