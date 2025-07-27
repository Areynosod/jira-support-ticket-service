import { FeedbackData } from "./types";

export const handleCreateIssue = async (feedbackData: FeedbackData) => {
  try {
    const now = new Date();
    const oneMonthFromNow = new Date(now);
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

    const formatDate =
      oneMonthFromNow.getFullYear() +
      "-" +
      String(oneMonthFromNow.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(oneMonthFromNow.getDate()).padStart(2, "0");
    const body = {
      fields: {
        project: {
          key: process.env.JIRA_PROJECT,
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
