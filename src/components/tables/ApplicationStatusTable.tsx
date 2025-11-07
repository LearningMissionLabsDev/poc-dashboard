import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Chip,
  Stack,
  Button,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AIUnderwriterDecision from "../ui/AIUnderwriterDecision";
import {
  ShieldCheck,
  ListChecks,
  Home,
  Building2,
  MapPin,
  User,
  BedDouble,
  Bath,
  Ruler,
  FileText,
  FileDown
} from "lucide-react";

export default function ApplicationStatusTable({ data }: any) {
  const borrower = data.borrower ?? {};
  const property = data.property ?? {};
  const documents = data.documents ?? {}
  const docs = documents?.ocrolus?.documents ?? [];
  const facta = borrower?.FACTA ?? { questions: [] };
  const ofac = borrower?.OFAC ?? {
    status: "Unknown",
    score: "N/A",
    results: [
      {
        matchCount: 0,
        matches: []
      }
    ]
  };
  const zillow = property?.zillow ?? {
    area: 0,
    address: "",
    price: 0,
    hdpData: { homeInfo: { bathrooms: 0, bedrooms: 0 } },
    beds: 0,
    baths: 0,
    statusText: "Unknown",
    estimated_value: 0,
    timestamp: "",
  };
  const aiSummary = {
    verdict: data.application.verdict ?? "Pending",
    reason: data.application.reason ?? "AI review not completed",
    score: data.application.score ?? 0,
  };

  const rentCast = property?.rentCast ?? {
    estimated_value: 0,
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    squareFootage: "?",
    owner: { names: ["Unknown owner"] },
    ownerOccupied: false,
    timestamp: "",
  };

  const formatCurrency = (value?: number) =>
    value ? `$${value.toLocaleString()}` : "N/A";

  const theme = useTheme();
  const ofacSection = {
    title: "Borrower",
    items: [
      {
        icon: <ShieldCheck size={28} color="#5B21B6" />,
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
        icon: <ListChecks size={28} color="#5B21B6" />,
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
    ],
  };

  const highestEstimate = property.summary?.highest_estimate;

  const getPropertyConfidenceColor = (estimate?: number) => {
    if (!highestEstimate || !estimate) {
      return { bg: "#F3F4F6", text: "#919191ff" };
    }
    const diff = Math.abs(highestEstimate - estimate);
    const diffPercent = (diff / highestEstimate) * 100;

    if (diffPercent <= 5) return { bg: "#C3F2D1E5", text: "#84DA9E" };
    if (diffPercent <= 15) return { bg: "#FEF3C7", text: "#f3bc93ff" };
    return { bg: "#FEE2E2", text: "#fa9d9dff" };
  };

  const zillowEstimate = zillow.estimated_value;

  const zillowSection = {
    title: "Property",
    items: [
      {
        icon: <Home size={28} color="#5B21B6" />,
        title: "Zillow",
        description: zillow.status ?? "Unknown",
        price: formatCurrency(zillow.hdpData.homeInfo.price),
        chips: [
          {
            icon: <MapPin size={16} style={{ color: "#0369A1" }} />,
            label: `${zillow.address ?? ""}, ${property.address?.city ?? ""}`,
            sx: { backgroundColor: "#E0F2FE", color: "#0369A1" },
          },
          {
            icon: <Bath size={16} style={{ color: "#6B21A8" }} />,
            label: `${zillow.hdpData.homeInfo.bathrooms ?? "?"} bathrooms`,
            sx: { backgroundColor: "#F3E8FF", color: "#6B21A8" },
          },
          {
            icon: <BedDouble size={16} style={{ color: "#6B21A8" }} />,
            label: `${zillow.hdpData.homeInfo.bedrooms ?? "?"} bedrooms`,
            sx: { backgroundColor: "#F3E8FF", color: "#6B21A8" },
          },
          {
            icon: <Ruler size={16} style={{ color: "#9D174D" }} />,
            label: `${zillow.area ?? "?"} sqft`,
            sx: { backgroundColor: "#FCE7F3", color: "#9D174D" },
          }
        ],
      },
    ],
  };

  // ✅ RentCast Section (💲 on right)
  const rentEstimate = rentCast.estimated_value;

  const rentcastSection = {
    title: "Property",
    items: [
      {
        icon: <Building2 size={28} color="#5B21B6" />,
        title: "RentCast",
        description: rentCast?.status,
        price: formatCurrency(rentCast.price),
        chips: [
          {
            icon: <MapPin size={16} style={{ color: "#0369A1" }} />,
            label: `${rentCast.formattedAddress ?? ""}, ${property.address?.city ?? ""}`,
            sx: { backgroundColor: "#E0F2FE", color: "#0369A1" },
          },
          {
            icon: <User size={16} style={{ color: "#1D4ED8" }} />,
            label: rentCast.owner.names[0] ?? "Unknown owner",
            sx: { backgroundColor: "#F1F5F9", color: "#475569" },
          },
          {
            icon: <Bath size={16} style={{ color: "#6B21A8" }} />,
            label: `${rentCast.bathrooms ?? "?"} bathrooms`,
            sx: { backgroundColor: "#F3E8FF", color: "#6B21A8" },
          },
          {
            icon: <BedDouble size={16} style={{ color: "#6B21A8" }} />,
            label: `${rentCast.bedrooms ?? "?"} bedrooms`,
            sx: { backgroundColor: "#F3E8FF", color: "#6B21A8" },
          },
          {
            icon: <Ruler size={16} style={{ color: "#9D174D" }} />,
            label: `${rentCast.squareFootage ?? "?"} sqft`,
            sx: { backgroundColor: "#FCE7F3", color: "#9D174D" },
          }
        ],
      },
    ],
  };

  const provided = {
    title: "Property",
    items: [
      {
        icon: <Building2 size={28} color="#5B21B6" />,
        title: "Black Knight",
        description: "Received",
        price: formatCurrency(property?.address.value)  ?? "-",
        chips: [
          {
            icon: <MapPin size={16} style={{ color: "#0369A1" }} />,
            label: `${rentCast.formattedAddress ?? ""}`,
            sx: { backgroundColor: "#E0F2FE", color: "#0369A1" },
          }
        ],
      },
    ],
  };
  function formatISO(iso: string = "") {
    if (!iso) return "N/A";
    return iso.replace("T", " ").replace("Z", "");
  }

  const documentSection = {
    title: "Documents",

    items: docs.map((doc: any) => ({
      confidence: `${doc?.status === "completed"
        ? `${doc?.form_analysis?.[0]?.form_authenticity?.score ?? 100}%`
        : doc?.status
        }`,
      icon: <FileText size={28} color="#5B21B6" />,
      title: doc.type || doc.name,
      subtitle: doc.name, // plain text shown below title
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
    })) ?? [],
  };

  const propertySection = {
    title: "Property",
    items: [
      ...provided.items,
      ...zillowSection.items,
      ...rentcastSection.items
      
    ],
  };

  const sections = [
    ofacSection,
    propertySection,
    documentSection
  ];

  const getConfidenceColor = (score: number) => {
    if (score <= 80) return { bg: "#FEE2E2", text: "#fa9d9dff" }; // RED (warning)
    return { bg: "#C3F2D1E5", text: "#84DA9E" }; // GREEN (normal)
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#FFFFFF",
          borderRadius: 2,
          boxShadow: "0px 1px 4px rgba(0,0,0,0.08)",
          p: 3,
        }}
      >
        {sections.map((section: any, i: number) => (
          <Box key={i} sx={{ mb: 1 }}>
            <Box
              sx={{
                backgroundColor: "#F5F9FF",
                borderRadius: "6px",
                px: 1.5,
                py: 0.7,
                my: 2,
              }}
            >
              <Typography
                sx={{
                  ...theme.typography.body2,
                  fontFamily: "Poppins,sans-serif",
                  fontWeight: 600,
                  color: "#000000",
                  fontSize: "0.9rem",
                  letterSpacing: "0.2px",
                }}
              >
                {section.title}
              </Typography>
            </Box>

            {section.items.map((item: any, j: number) => {
              const conf = typeof item.confidence === "string"
                ? parseInt(item.confidence) || 0
                : item.confidence ?? 0;
              const colors = getConfidenceColor(conf);
              return (
                <Accordion
                  key={j}
                  sx={{
                    mb: 2,
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px !important",
                    "&:before": { display: "none" },
                    backgroundColor: "#FFFFFF",
                    boxShadow: "none",
                    overflow: "hidden",
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "#6B7280" }} />}
                    sx={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "8px",
                      "& .MuiAccordionSummary-content": {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      },
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      {item.icon}
                      <Box>
                        <Typography
                          sx={{
                            ...theme.typography.body2,
                            fontFamily: "Poppins,sans-serif",
                            fontWeight: 600,
                            color: "#000000CC",
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          sx={{
                            ...theme.typography.body2,
                            fontFamily: "Poppins,sans-serif",
                            fontWeight: 400,
                            color: "#000000CC",
                            lineHeight: 1.4,
                          }}
                        >
                          {item.description}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* === RIGHT-SIDE CHIP === */}
                    {item.price ? (
                      <Chip
                        label={item.price}
                        size="small"
                        sx={{
                          ...theme.typography.body2,
                          fontFamily: "Poppins,sans-serif",
                          backgroundColor: getPropertyConfidenceColor(
                            item.price === formatCurrency(zillowEstimate)
                              ? zillowEstimate
                              : rentEstimate
                          ).bg,
                          color: "#000000CC",
                          fontWeight: 400,
                          borderRadius: "6px",
                          border: `1px solid ${getPropertyConfidenceColor(
                            item.price === formatCurrency(zillowEstimate)
                              ? zillowEstimate
                              : rentEstimate
                          ).text
                            }`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          lineHeight: 1.1,
                        }}
                      />
                    ) : (
                      <Chip
                        label={item.confidence}
                        size="small"
                        sx={{
                          ...theme.typography.body2,
                          fontFamily: "Poppins,sans-serif",
                          backgroundColor: colors.bg,
                          border: `1px solid ${colors.text}`,
                          color: "#000000CC",
                          fontWeight: 400,
                          borderRadius: "6px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          lineHeight: 1.1,
                        }}
                      />
                    )}
                  </AccordionSummary>

                  <AccordionDetails sx={{ backgroundColor: "#FFFFFF", pt: 0, }}>
                    {/* === FILE DOWNLOAD BUTTONS === */}
                    {"downloadUrl" in item && (
                      <Box sx={{ mt: 1, mb: 1.5 }}>
                        <Button
                          startIcon={<FileDown size={18} color="#FFFFFF" />}
                          variant="contained"
                          size="small"
                          component="a"
                          href={item.downloadUrl}
                          download
                          target="_blank"
                          sx={{
                            ...theme.typography.body2,
                            fontFamily: "Poppins,sans-serif",
                            fontWeight: 500,
                            boxShadow: "none",
                            textTransform: "none",
                            borderRadius: "8px",
                            backgroundColor: "#DC2626",
                            "&:hover": { backgroundColor: "#B91C1C", boxShadow: "none", },
                          }}
                        >
                          Download PDF
                        </Button>
                      </Box>
                    )}


                    {/* ✅ Property view with chips */}
                    {"chips" in item && item.chips ? (
                      <Stack direction="row" flexWrap="wrap" gap={2} sx={{ mt: 0, pt: 0 }}>
                        {item.chips.map((chip: any, k: number) => (
                          <Box
                            key={k}
                            sx={{
                              ...theme.typography.body2,
                              fontFamily: "Poppins,sans-serif",
                              fontWeight: 400,
                              display: "flex",
                              alignItems: "center",
                              gap: 0.8,
                              backgroundColor: "#F3F4F6",
                              borderRadius: "8px",
                              px: 1.5,
                              py: 0.5,
                              color: "#000000CC",
                              justifyContent: "center",
                              lineHeight: 1.1,
                            }}
                          >
                            <span>{chip.icon}</span>
                            <span>{chip.label}</span>
                          </Box>
                        ))}
                      </Stack>
                    ) : (
                      item.details?.map((d: any, k: number) => (
                        <Box key={k}>
                          <Typography
                            sx={{
                              ...theme.typography.body2,
                              fontFamily: "Poppins,sans-serif",
                              fontWeight: 400,
                              color: "#000000CC",
                              display: "inline",
                            }}
                            component="span"
                          >
                            {d.label}:{" "}
                          </Typography>
                          <Typography
                            sx={{
                              ...theme.typography.body2,
                              fontFamily: "Poppins,sans-serif",
                              fontWeight: 400,
                              color: "#000000CC",
                              display: "inline",
                            }}
                            component="span"
                          >
                            {Array.isArray(d.value) ? d.value.join(", ") : d.value}
                          </Typography>
                        </Box>
                      ))
                    )}
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 3,
          mt: 4,
          width: "100%",
        }}
      >
        <AIUnderwriterDecision
          verdict={aiSummary.verdict}
          reason={aiSummary.reason}
          score={aiSummary.score}
          onSubmit={(decision, reason) => {
            console.log("Underwriter Decision Sent:", { decision, reason });
          }}
        />
      </Box>
    </>
  );
}

function maskSSN(value: string = "") {
  if (!value) return "N/A";

  const digits = value.replace(/\D/g, ""); // remove non-digits

  if (digits.length < 4) return "***-**-" + digits;
  return "***-**-" + digits.slice(-4);
}