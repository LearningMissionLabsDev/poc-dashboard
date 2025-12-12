export const formatCurrency = (value?: number) =>
  value ? `$${value.toLocaleString()}` : "N/A";

export const formatISO = (iso: string = ""): string => {
  if (!iso) return "N/A";
  return iso.replace("T", " ").replace("Z", "");
}

export const getConfidenceColor = (score: number) => {
  if (score <= 80) return { bg: "#FEE2E2", text: "#fa9d9dff" };
  return { bg: "#C3F2D1E5", text: "#84DA9E" };
};

export const getPropertyConfidenceColor = (
  estimate: number,
  highestEstimate: number
) => {
  if (!highestEstimate || !estimate) {
    return { bg: "#F3F4F6", text: "#919191ff" };
  }
  const diff = Math.abs(highestEstimate - estimate);
  const diffPercent = (diff / highestEstimate) * 100;

  if (diffPercent <= 5) return { bg: "#C3F2D1E5", text: "#84DA9E" };
  if (diffPercent <= 15) return { bg: "#FEF3C7", text: "#f3bc93ff" };
  return { bg: "#FEE2E2", text: "#fa9d9dff" };
};