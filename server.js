const express = require("express")
const { MongoClient } = require("mongodb")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

// Connessione MongoDB (Docker)
const client = new MongoClient("mongodb://admin:password@localhost:27017")

let db

async function connectDB() {
  await client.connect()
  db = client.db("greenwheel")
  console.log("✅ Connesso a MongoDB GreenWheel")
}

connectDB()

//prendi una corsa e la sua route
app.get("/route/:id", async (req, res) => {
  try {
    const rental = await db.collection("rentals").findOne({
      rental_id: req.params.id
    })

    if (!rental) {
      return res.status(404).json({ error: "Corsa non trovata" })
    }

    res.json(rental.route)

  } catch (err) {
    res.status(500).json({ error: "Errore server" })
  }
})

// veicoli con batteria bassa
app.get("/low-battery", async (req, res) => {
  const vehicles = await db.collection("vehicles")
    .find({ battery: { $lt: 20 } })
    .toArray()

  res.json(vehicles)
})

//totale speso utente
app.get("/spent/:userId", async (req, res) => {
  const result = await db.collection("rentals").aggregate([
    {
      $match: {
        user_id: req.params.userId
      }
    },
    {
      $group: {
        _id: "$user_id",
        total_spent: { $sum: "$total_cost" }
      }
    }
  ]).toArray()

  res.json(result)
})

//avvio server
app.listen(3000, () => {
  console.log("Server GreenWheel attivo su http://localhost:3000")
})