import { FC } from "hono/jsx";

export const FeedbackSuccessMessage: FC<{
  message?: string;
  queryParams?: string;
}> = ({
  message = "Thank you for your feedback. We'll get back to you soon!",
}) => {
  return (
    <div class="bg-green-700 bg-opacity-20 p-6 rounded-lg">
      <div class="flex items-center mb-4">
        <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4">
          <span class="text-sm font-bold">✓</span>
        </div>
        <h3 class="text-lg font-semibold text-green-400">Feedback Submitted</h3>
      </div>
      <p class="text-green-300 mb-4">{message}</p>
      <button
        class="oa-button"
        hx-params="*"
        hx-select="#feedback-form-container"
        hx-target="#feedback-form-container"
        hx-swap="outerHTML"
      >
        Send Another
      </button>
    </div>
  );
};
