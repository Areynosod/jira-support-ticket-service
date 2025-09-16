import { FeedbackData, TurnstileVerifyResponse } from "./types";

export const handleCreateIssue = async ({
  feedbackData,
  project,
  file,
}: {
  feedbackData: FeedbackData;
  project: string;
  file: File | null;
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
          name: feedbackData.priority || "Lowest",
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

    const issueData = await response.json();
    const issueKey = issueData.key;

    if (file && issueKey) {
      await attachFileToIssue(issueKey, file);
    }

    return issueData;
  } catch (error) {
    console.error("Error creating issue:", error);
    throw error;
  }
};

const attachFileToIssue = async (issueKey: string, file: File) => {
  try {
    if (!file.name || file.size === 0) {
      throw new Error("Invalid file: File must have a name and content");
    }

    const MAX_FILE_SIZE = 20 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(
        `File too large: ${file.size} bytes. Maximum allowed: ${MAX_FILE_SIZE} bytes`
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const formData = new FormData();

    const blob = new Blob([buffer], {
      type: file.type || "application/octet-stream",
    });
    formData.append("file", blob, file.name);

    const headers = {
      Authorization: `Basic ${Buffer.from(
        `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`
      ).toString("base64")}`,
      "X-Atlassian-Token": "no-check",
    };

    const attachmentResponse = await fetch(
      `${process.env.JIRA_BASE_URL}/rest/api/2/issue/${issueKey}/attachments`,
      {
        method: "POST",
        headers: headers,
        body: formData,
      }
    );

    if (!attachmentResponse.ok) {
      let errorText = "";
      try {
        errorText = await attachmentResponse.text();
      } catch (e) {
        errorText = "Could not parse error response";
      }

      console.error("Error attaching file to JIRA:", {
        status: attachmentResponse.status,
        statusText: attachmentResponse.statusText,
        //@ts-ignore
        headers: Object.fromEntries(attachmentResponse.headers.entries()),
        errorText,
      });

      throw new Error(
        `Failed to attach file: ${attachmentResponse.status} ${attachmentResponse.statusText}. Details: ${errorText}`
      );
    }

    const attachmentData = await attachmentResponse.json();
    return attachmentData;
  } catch (error) {
    console.error("Error in attachFileToIssue:", error);
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
