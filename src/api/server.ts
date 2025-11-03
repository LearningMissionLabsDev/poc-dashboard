import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import neo4j from "neo4j-driver";

// ─────────────────────────────────────────────────────────────
//  Load environment variables
// ─────────────────────────────────────────────────────────────
dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// ─────────────────────────────────────────────────────────────
//  Initialize Neo4j driver
// ─────────────────────────────────────────────────────────────
const driver = neo4j.driver(
  process.env.NEO4J_URI || "",
  neo4j.auth.basic(
    process.env.NEO4J_USER || "",
    process.env.NEO4J_PASS || ""
  )
);

// ─────────────────────────────────────────────────────────────
//  CORS setup (adjust origins as needed)
// ─────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: ["http://localhost:5173"], // Frontend dev URL
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);

// ─────────────────────────────────────────────────────────────
//  Middleware
// ─────────────────────────────────────────────────────────────
app.use(express.json());

// ─────────────────────────────────────────────────────────────
//  Health check route
// ─────────────────────────────────────────────────────────────
app.get("/", (_req: Request, res: Response) => {
  res.send("✅ Backend running successfully");
});

// ─────────────────────────────────────────────────────────────
//  API: Get all applications
// ─────────────────────────────────────────────────────────────
app.get("/api/applications", async (_req: Request, res: Response) => {
  const session = driver.session();

  try {
    const result = await session.run(`
    MATCH (a:Application)
OPTIONAL MATCH (a)-[:HAS_BORROWER]->(b:Borrower)
OPTIONAL MATCH (a)-[:HAS_UNDERWRITER]->(u:Underwriter)
OPTIONAL MATCH (a)-[:HAS_DOCUMENT]->(d:Document)
WITH a.application_id AS id,
     collect(DISTINCT b)[0] AS borrower,
     collect(DISTINCT u)[0] AS underwriter,
     collect(DISTINCT d.file_description) AS reason_names,
     max(coalesce(a.updated_at, a.last_update, a.created_at)) AS last_updated,
     max(a.status) AS reason_status,
     max(a.requested_amount) AS requested_amount,
     max(a.source_channel) AS source_channel,
     max(a.source) AS source,
     max(a.product) AS product,
     max(a.merchant_name) AS merchant_name
RETURN {
  id: id,
  application_id: id,
  borrower_name: coalesce(borrower.first_name + ' ' + borrower.last_name, ''),
  borrower_email: borrower.email,
  reviewer: coalesce(underwriter.first_name + ' ' + underwriter.last_name, ''),
  reviewer_email: underwriter.email,
  reason_name: reason_names[0],
  reason_names: reason_names,
  reason_status: reason_status,
  last_updated: last_updated,
  requested_amount: requested_amount,
  source_channel: source_channel,
  source: source,
  product: product,
  merchant_name: merchant_name
} AS application
ORDER BY last_updated DESC
    `);

    const data = result.records.map((r) => r.get("application"));
    res.json({ data, total: data.length });
  } catch (err: any) {
    console.error("Neo4j query failed:", err.message || err);
    res.status(500).json({ error: "Failed to fetch applications" });
  } finally {
    await session.close();
  }
});

// ─────────────────────────────────────────────
//  API: Get detailed application status
// ─────────────────────────────────────────────
app.get("/api/applications/:id/status", async (req: Request, res: Response) => {
  const session = driver.session();
  const { id } = req.params;

  try {
    const result = await session.run(
      `
      MATCH (a:Application {application_id: $id})
      OPTIONAL MATCH (a)-[:HAS_BORROWER]->(b:Borrower)
      OPTIONAL MATCH (b)-[:PERSONAL_CHECK]->(ofac:OFAC)
      OPTIONAL MATCH (b)-[:PERSONAL_CHECK]->(facta:FACTA)
      OPTIONAL MATCH (a)-[:HAS_ADDRESS]->(addr:Address)
      OPTIONAL MATCH (addr)-[:PROPERTY_CHECK]->(zillow:Zillow)
      OPTIONAL MATCH (addr)-[:PROPERTY_CHECK]->(rentcast:RentCast)
      OPTIONAL MATCH (a)-[:HAS_DOCUMENT]->(doc:Document)
      OPTIONAL MATCH (doc)-[:VALIDITY_CHECK]->(ocr:OcrolusValidation)

      RETURN {
        application_id: a.application_id,
        status: a.status,
        created_at: a.created_at,
        updated_at: a.updated_at,

        borrower: {
          first_name: b.first_name,
          last_name: b.last_name,
          email: b.email,
          ssn: b.ssn,
          income: b.income,
          dob: b.dob
        },

        person_checks: collect(DISTINCT {
          type: labels(ofac)[0],
          description: ofac.name,
          status: ofac.status,
          matchCount: ofac.matchCount,
          timestamp: ofac.timestamp
        }) + collect(DISTINCT {
          type: labels(facta)[0],
          title: facta.title,
          description: facta.description,
          createdAt: facta.createdAt
        }),

        property: {
          address: addr.street + ', ' + addr.city + ', ' + addr.state + ' ' + addr.zip,
          zillow: {
            address: zillow.address,
            price: zillow.price,
            area: zillow.area,
            beds: zillow.beds,
            baths: zillow.baths,
            estimate: zillow.estimate,
            timestamp: zillow.timestamp
          },
          rentcast: {
            address: rentcast.address,
            price: rentcast.price,
            owner_occupied: rentcast.owner_occupied,
            area: rentcast.area,
            beds: rentcast.beds,
            baths: rentcast.baths,
            estimate: rentcast.estimate,
            timestamp: rentcast.timestamp
          }
        },

        documents: collect(DISTINCT {
          file_description: doc.file_description,
          fileName: doc.fileName,
          type: doc.type,
          status: doc.status,
          timestamp: doc.timestamp,
          validations: collect(DISTINCT {
            score: ocr.page_count,
            status: ocr.status,
            file_description: ocr.file_description,
            timestamp: ocr.timestamp
          })
        })
      } AS application_status
      `,
      { id }
    );

    if (result.records.length === 0) {
      return res.status(404).json({ error: "Application not found" });
    }

    const status = result.records[0].get("application_status");
    res.json(status);
  } catch (err: any) {
    console.error("Neo4j query failed:", err.message || err);
    res.status(500).json({ error: "Failed to fetch application status" });
  } finally {
    await session.close();
  }
});

// ─────────────────────────────────────────────────────────────
//  API: Get single application by ID
// ─────────────────────────────────────────────────────────────
app.get("/api/applications/:id", async (req: Request, res: Response) => {
  const session = driver.session();
  try {
    const result = await session.run(
      `
      MATCH (a:Application {application_id: $id})
      RETURN a {
        .application_id,
        .name,
        .income,
        .status,
        .submittedAt
      } AS application
      `,
      { id: req.params.id }
    );

    if (result.records.length === 0) {
      return res.status(404).json({ error: "Application not found" });
    }

    const application = result.records[0].get("application");
    res.json(application);
  } catch (err: any) {
    console.error("Neo4j query failed:", err.message || err);
    res.status(500).json({ error: "Failed to fetch application" });
  } finally {
    await session.close();
  }
});

// ─────────────────────────────────────────────────────────────
//  API: Create a new application
// ─────────────────────────────────────────────────────────────
app.post("/api/applications", async (req: Request, res: Response) => {
  const session = driver.session();
  const { application_id, name, income, status } = req.body;

  try {
    const result = await session.run(
      `
      CREATE (a:Application {
        application_id: $application_id,
        name: $name,
        income: $income,
        status: $status,
        submittedAt: datetime()
      })
      RETURN a {
        .application_id,
        .name,
        .income,
        .status,
        .submittedAt
      } AS application
      `,
      { application_id, name, income, status }
    );

    const newApp = result.records[0].get("application");
    res.status(201).json(newApp);
  } catch (err: any) {
    console.error("Error creating application:", err.message || err);
    res.status(500).json({ error: "Failed to create application" });
  } finally {
    await session.close();
  }
});

// ─────────────────────────────────────────────────────────────
//  API: Delete an application
// ─────────────────────────────────────────────────────────────
app.delete("/api/applications/:id", async (req: Request, res: Response) => {
  const session = driver.session();
  try {
    await session.run(`MATCH (a:Application {application_id: $id}) DETACH DELETE a`, {
      id: req.params.id,
    });
    res.status(204).end();
  } catch (err: any) {
    console.error("Error deleting application:", err.message || err);
    res.status(500).json({ error: "Failed to delete application" });
  } finally {
    await session.close();
  }
});

// ─────────────────────────────────────────────────────────────
//  Start server
// ─────────────────────────────────────────────────────────────
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

// ─────────────────────────────────────────────────────────────
//  Graceful shutdown
// ─────────────────────────────────────────────────────────────
process.on("SIGINT", async () => {
  console.log("\n🔻 Closing Neo4j driver...");
  await driver.close();
  process.exit(0);
});