import type { SectionItem } from "../types";

export function buildBorrowerItems(borrower: any): SectionItem[] {
    const facta = borrower?.FACTA ?? { questions: [] };
    const ofac = borrower?.OFAC ?? {
        status: "Unknown",
        score: "N/A",
        results: [{ matchCount: 0, matches: [] }],
    };

    return [
        {
            icon: null,
            title: "OFAC",
            description: "matches found " + ofac.results[0].matchCount,
            confidence: `${ofac?.score ?? 0}%`,
            details: [
                ...(ofac.results[0].matches ?? []).map((m: any) => ({
                    label: m.matchSummary.matchFields[0].sanctionField,
                    value: ` ---Similarity: ${m.score}`,
                })),
            ],
        },

        {
            icon: null,
            title: "FACTA",
            description: "questions " + facta.questions.length,
            confidence:
                facta?.status === "processing"
                    ? "processing"
                    : `${facta?.score}%`,
            details: [
                ...(facta.questions ?? []).map((q: any) => {
                    const userAnswer = q.answers.find((a: any) => a.id === q.user_answer_id);
                    const correctAnswer = q.answers.find((a: any) => a.id === q.correct_answer_id);

                    return {
                        label: q.question_text,
                        value: q.is_correct
                            ? `---✅ Correct: ${userAnswer?.text}`
                            : `---❌ Your answer: ${userAnswer?.text} — Correct: ${correctAnswer?.text}`
                    };
                }),
            ],
        },
    ];
}