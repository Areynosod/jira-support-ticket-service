import { Hono } from "hono";
import { FeedbackErrorMessage } from "../components/feedback/feedback-error-message";
import { FeedbackForm } from "../components/feedback/feedback-form";
import Layout from "../components/layout";
import { FeedbackData } from "@/utils/types";
import { FeedbackSuccessMessage } from "@/components/feedback/feedback-success-message";
import { zValidator } from "@hono/zod-validator";
import { feedbackSchema, FeedbackType } from "@/schema/feedback-schema";
import { getTitle } from "private";
import NoProject from "@/components/no-project";
import { projectSchema } from "@/schema/project-schema";
import { handleCreateIssue, verifyResCloudflare } from "@/utils/functions";

const feedback = new Hono();

feedback.get(
  "/",
  zValidator("query", projectSchema, (result, c) => {
    if (!result.success) {
      return c.html(<NoProject />);
    }
  }),
  (c) => {
    const { project } = c.req.valid("query");
    const title = getTitle(project);

    return c.html(
      <Layout>
        <h1 className="text-4xl font-light text-center mb-4">{title}</h1>
        <div>
          <FeedbackForm data={null} errors={[]} project={project} />
        </div>
      </Layout>
    );
  }
);

feedback.post(
  "/",
  zValidator("query", projectSchema, (result, c) => {
    if (!result.success) {
      return c.html(<NoProject />);
    }
  }),
  zValidator("form", feedbackSchema, (result, c) => {
    if (!result.success) {
      const errors = result.error.issues.map((issue) => issue.message);
      const project = c.req.query("project") || "";
      return c.html(
        <FeedbackForm
          data={result.data as FeedbackType}
          errors={errors}
          project={project}
        />
      );
    }
  }),
  async (c) => {
    try {
      const { project } = c.req.valid("query");

      const body = await c.req.parseBody();
      const turnstileToken = body["cf-turnstile-response"]?.toString();

      const verifyData = await verifyResCloudflare(turnstileToken);
      if (!verifyData.success) {
        return c.html(
          <FeedbackErrorMessage message="Verification failed. Please try again." />
        );
      }

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
      const queryParams = `/?project=${project}`;
      await handleCreateIssue({
        feedbackData: data,
        project,
      });

      return c.html(<FeedbackSuccessMessage queryParams={queryParams} />);
    } catch (error: any) {
      const { project } = c.req.valid("query");
      const queryParams = `/?project=${project}`;
      console.error("Unhandled error in feedback submission:", error);
      return c.html(
        <FeedbackErrorMessage
          queryParams={queryParams}
          message={error.message}
        />
      );
    }
  }
);

export default feedback;
