import { FC } from "hono/jsx";

export const FeedbackSuccessMessage: FC<{
  message?: string;
  queryParams?: string;
}> = ({
  message = "Thank you for your feedback. We'll get back to you soon!",
  queryParams = "/",
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
            hx-get={queryParams}
            hx-target="#main-content"
            hx-on="htmx:afterRequest: if(event.detail.xhr.status === 200) { setTimeout(() => { if(typeof turnstile !== 'undefined') turnstile.reset(); }, 100); }"
          >
            Send Another
          </button>
        </div>
      </div>
    </div>
  );
};
