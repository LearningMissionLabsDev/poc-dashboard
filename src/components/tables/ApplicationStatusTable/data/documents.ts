import type { SectionItem } from "../types";
import { formatISO } from "../utils";

export function buildDocumentItems(documents: any): SectionItem[] {
    const docs = documents?.ocrolus?.documents ?? [];

    return (
        docs.map((doc: any) => ({
            confidence: `${doc?.status === "completed"
                ? `${doc?.form_analysis?.[0]?.form_authenticity?.score ?? 100}%`
                : doc?.status
                }`,
            icon: null,
            title: doc.type || doc.name,
            subtitle: doc.name,
            downloadUrl: doc.dowmload_url ?? "#",
            description: doc.name,

            details: [
                { label: "Created", value: formatISO(doc.created_ts) },
                { label: "Status", value: doc.status },
                {
                    label: "Suspicious Activity",
                    value:
                        doc.form_analysis?.[0]?.form_authenticity?.reason_codes?.length > 0
                            ? doc.form_analysis[0].form_authenticity.reason_codes
                                .map((r: any) => r.description)
                                .join(", ")
                            : "No signals detected",
                },
            ],
        })) ?? []
    );
}