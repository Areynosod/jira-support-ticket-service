import { FeedbackData, TurnstileVerifyResponse } from "./types";

export const handleCreateIssue = async ({
  feedbackData,
  project,
}: {
  feedbackData: FeedbackData;
  project: string;
}) => {
  try {
    const now = new Date();
    const oneMonthFromNow = new Date(now);
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    const JIRA_PROJECT = project.toUpperCase();

    const formatDate =
      oneMonthFromNow.getFullYear() +
      "-" +
      String(oneMonthFromNow.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(oneMonthFromNow.getDate()).padStart(2, "0");
    const body = {
      fields: {
        project: {
          key: JIRA_PROJECT,
        },
        summary: `${feedbackData.type.toUpperCase()}: Feedback from ${
          feedbackData.full_name
        }`,
        description: `From: ${feedbackData.full_name}\nEmail: ${feedbackData.email}\nType: ${feedbackData.type}\n\n${feedbackData.description}\n\n`,
        priority: {
          name: feedbackData.type === "Bug" ? "High" : "Medium",
        },
        duedate: formatDate,
        issuetype: {
          name: "Task",
        },
      },
    };

    const headers = {
      Authorization: `Basic ${Buffer.from(
        `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`
      ).toString("base64")}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const response = await fetch(
      `${process.env.JIRA_BASE_URL}/rest/api/2/issue`,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Jira API error details:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, details: ${errorText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating issue:", error);
    throw error;
  }
};

export const verifyResCloudflare = async (
  turnstileToken: string
): Promise<TurnstileVerifyResponse> => {
  const secretKey = process.env.CF_SECRET_KEY!;

  const verifyRes = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: secretKey,
        response: turnstileToken,
      }),
    }
  );

  const data: TurnstileVerifyResponse = await verifyRes.json();
  return data;
};
