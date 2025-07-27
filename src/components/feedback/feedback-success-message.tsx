import { FC } from "hono/jsx";

export const FeedbackSuccessMessage: FC<{
  message?: string;
  queryParams?: string;
}> = ({
  message = "Thank you for your feedback. We'll get back to you soon!",
}) => {
  return (
    <div class="w-full max-w-md mx-auto rounded-none sm:rounded-md">
      <div class="bg-green-200 p-2 rounded-lg">
        <div class="flex items-center justify-center">
          <div class="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center mr-4">
            <span class="text-xl font-bold text-white">✓</span>
          </div>
        </div>
        <h3 class="text-xl font-bold text-white text-center">
          Feedback Submitted
        </h3>
        <p class="text-black text-center">{message}</p>

        <div className="flex justify-center">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            hx-get="/"
            hx-target="#main-content"
          >
            Send Another
          </button>
        </div>
      </div>
    </div>
  );
};
