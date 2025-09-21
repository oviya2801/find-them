const { MongoClient } = require("mongodb")

async function setupMongoDB() {
  const client = new MongoClient(process.env.MONGODB_URI)

  try {
    await client.connect()
    const db = client.db("findthem")

    // Create collections with indexes
    await db.createCollection("organizations")
    await db.createCollection("users")
    await db.createCollection("cases")
    await db.createCollection("sightings")
    await db.createCollection("photo_embeddings")

    // Create indexes for better performance
    await db.collection("cases").createIndex({ status: 1 })
    await db.collection("cases").createIndex({ organization_id: 1 })
    await db.collection("cases").createIndex({ created_at: -1 })
    await db.collection("sightings").createIndex({ case_id: 1 })
    await db.collection("sightings").createIndex({ status: 1 })
    await db.collection("organizations").createIndex({ verification_status: 1 })
    await db.collection("users").createIndex({ email: 1 }, { unique: true })

    // Insert sample data
    await db.collection("organizations").insertMany([
      {
        name: "Missing Children Foundation",
        type: "ngo",
        contact_email: "contact@mcf.org",
        contact_phone: "+1-555-0123",
        verification_status: "verified",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "City Police Department",
        type: "police",
        contact_email: "missing@citypolice.gov",
        contact_phone: "+1-555-0911",
        verification_status: "verified",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])

    console.log("MongoDB setup completed successfully!")
  } catch (error) {
    console.error("MongoDB setup failed:", error)
  } finally {
    await client.close()
  }
}

setupMongoDB()
