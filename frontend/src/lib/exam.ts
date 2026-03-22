export function formatExamTitle(createdAt: string, selectedParts: string[]) {
  const date = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (selectedParts.length === 1) {
    return `${selectedParts[0]} Practice · ${date}`;
  }

  return `Mock Exam · ${date}`;
}
