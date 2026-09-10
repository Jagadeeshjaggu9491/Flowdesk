export function generateAutoDescription(title: string, type: "project" | "task"): string {
  if (!title || !title.trim()) {
    return "";
  }

  const cleanTitle = title.trim();

  if (type === "project") {
    return `Comprehensive execution plan for "${cleanTitle}". This initiative encompasses design system alignment, key feature implementation, cross-team milestone tracking, and quality assurance review to ensure high-performance delivery.`;
  }

  // Task description templates based on keywords
  const lower = cleanTitle.toLowerCase();

  if (lower.includes("design") || lower.includes("ui") || lower.includes("ux") || lower.includes("navbar") || lower.includes("screen")) {
    return `Create and refine UI/UX assets for "${cleanTitle}". Deliver iOS-aligned visual components, responsive layouts across mobile & desktop viewports, and interactive state feedback.`;
  }

  if (lower.includes("auth") || lower.includes("login") || lower.includes("api") || lower.includes("backend") || lower.includes("db") || lower.includes("database")) {
    return `Implement technical logic and REST API endpoints for "${cleanTitle}". Ensure strict input validation, multi-tenant workspace authorization checks, error handling, and unit test coverage.`;
  }

  if (lower.includes("test") || lower.includes("qa") || lower.includes("audit") || lower.includes("bug")) {
    return `Execute thorough testing and verification suite for "${cleanTitle}". Validate edge cases, cross-workspace security boundaries, and responsive viewport behavior.`;
  }

  return `Execute deliverables for "${cleanTitle}". Review specifications, build requested features, document implementation, and coordinate with team members for code review.`;
}
