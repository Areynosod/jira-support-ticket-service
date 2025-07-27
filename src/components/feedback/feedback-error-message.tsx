import { FC } from "hono/jsx";

export const FeedbackErrorMessage: FC<{
  message?: string;
  queryParams?: string;
}> = ({
  message = "There was an error submitting your feedback. Please try again.",
  queryParams = "",
}) => {
  return (
    <div class="bg-red-200 p-2 rounded-lg">
      <div class="flex items-center justify-center ">
        <div class="w-8 h-8 bg-red-400 rounded-full flex items-center justify-center mr-4">
          <span class="text-xl font-bold text-white">!</span>
        </div>
      </div>
      <h3 class="text-xl font-bold text-white text-center">Submission Error</h3>
      <p class="text-black  text-center">{message}</p>

      <div className="flex justify-center">
        <button type="button" className="btn btn-outline btn-sm">
          Try Again
        </button>
      </div>
    </div>
  );
};
