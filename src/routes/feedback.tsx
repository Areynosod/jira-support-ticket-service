import { Hono } from "hono";
import { FeedbackErrorMessage } from "../components/feedback/feedback-error-message";
import { FeedbackForm } from "../components/feedback/feedback-form";
import Layout from "../components/layout";
import { FeedbackData } from "@/utils/types";
import { FeedbackSuccessMessage } from "@/components/feedback/feedback-success-message";
import { zValidator } from "@hono/zod-validator";
import { feedbackSchema, FeedbackType } from "@/schema/feedback-schema";

const feedback = new Hono();

feedback.get("/", (c) => {
  return c.html(
    <Layout>
      <h1 className="text-4xl font-light text-center mb-4">
        {process.env.TITLE}
      </h1>
      <div>
        <FeedbackForm data={null} errors={[]} />
      </div>
    </Layout>
  );
});

feedback.post(
  "/",
  zValidator("form", feedbackSchema, (result, c) => {
    if (!result.success) {
      const errors = result.error.issues.map((issue) => issue.message);
      return c.html(
        <FeedbackForm data={result.data as FeedbackType} errors={errors} />
      );
    }
  }),
  async (c) => {
    try {
      const formData = await c.req.formData();

      const data: FeedbackData = {
        full_name: formData.get("full_name") as string,
        email: formData.get("email") as string,
        description: formData.get("description") as string,
        type: formData.get("type") as
          | "Question"
          | "Feedback"
          | "Feature Request"
          | "Bug",
      };

      return c.html(
        <FeedbackSuccessMessage
          queryParams={`?email=${data.email}&name=${data.full_name}`}
        />
      );
    } catch (error) {
      console.error("Unhandled error in feedback submission:", error);
      return c.html(<FeedbackErrorMessage />);
    }
  }
);

export default feedback;
