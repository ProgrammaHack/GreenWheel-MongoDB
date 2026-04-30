# GREENWHEEL – DOCUMENTAZIONE MONGODB

---

## 1. CREAZIONE DATABASE

Creazione del database tramite MongoDB shell (mongosh):

```bash
use greenwheel
````

### Spiegazione

Questo comando crea (se non esiste) e seleziona il database **greenwheel**, che conterrà tutte le collezioni del progetto.

---

## 2. CREAZIONE COLLEZIONI

Creazione delle collezioni principali del sistema:

```bash
db.createCollection("users")
db.createCollection("vehicles")
db.createCollection("rentals")
```

### Spiegazione

Le collezioni rappresentano le entità principali:

* users → utenti del servizio
* vehicles → flotta dei veicoli
* rentals → storico delle corse

---

## 3. SCHEMI E INSERIMENTO DATI

MongoDB non utilizza schemi rigidi, ma si definisce una struttura logica dei documenti.

---

## 3.1 USERS

### Schema logico

```js
{
  user_id: String,
  name: String,
  payment_method: String,
  rating: Number
}
```

### Inserimento dati

```js
db.users.insertMany([
  { user_id: "U001", name: "Mario Rossi", payment_method: "token_1", rating: 4.8 },
  { user_id: "U002", name: "Giulia Bianchi", payment_method: "token_2", rating: 4.6 },
  { user_id: "U003", name: "Luca Verdi", payment_method: "token_3", rating: 4.7 },
  { user_id: "U004", name: "Francesca Russo", payment_method: "token_4", rating: 4.9 },
  { user_id: "U005", name: "Andrea Ferrari", payment_method: "token_5", rating: 4.5 },
  { user_id: "U006", name: "Alessandro Colombo", payment_method: "token_6", rating: 4.4 },
  { user_id: "U007", name: "Martina Romano", payment_method: "token_7", rating: 4.8 },
  { user_id: "U008", name: "Davide Conti", payment_method: "token_8", rating: 4.2 },
  { user_id: "U009", name: "Elena Galli", payment_method: "token_9", rating: 4.9 },
  { user_id: "U010", name: "Marco Lombardi", payment_method: "token_10", rating: 4.3 },
  { user_id: "U011", name: "Sara Fontana", payment_method: "token_11", rating: 4.7 },
  { user_id: "U012", name: "Giorgio Ricci", payment_method: "token_12", rating: 4.1 },
  { user_id: "U013", name: "Chiara Moretti", payment_method: "token_13", rating: 4.6 },
  { user_id: "U014", name: "Antonio Greco", payment_method: "token_14", rating: 4.0 },
  { user_id: "U015", name: "Valentina Marino", payment_method: "token_15", rating: 4.9 },
  { user_id: "U016", name: "Stefano De Luca", payment_method: "token_16", rating: 4.3 },
  { user_id: "U017", name: "Federica Rinaldi", payment_method: "token_17", rating: 4.8 },
  { user_id: "U018", name: "Matteo Barbieri", payment_method: "token_18", rating: 4.2 },
  { user_id: "U019", name: "Beatrice Serra", payment_method: "token_19", rating: 4.7 },
  { user_id: "U020", name: "Nicola Mancini", payment_method: "token_20", rating: 4.4 }
])
```

---

## 3.2 VEHICLES

### Schema logico

```js
{
  vehicle_id: String,
  type: String,
  model: String,
  battery: Number,
  position: {
    lat: Number,
    lon: Number
  },
  extra_specs: Object
}
```

### Inserimento dati

```js
db.vehicles.insertMany(
Array.from({ length: 50 }).map((_, i) => {

  const types = [
    { type: "Monopattino", models: ["Xiaomi Pro 2", "Xiaomi Essential", "Segway Air"] },
    { type: "Bici Elettrica", models: ["VanMoof S3", "Specialized Turbo", "Cube Hybrid"] },
    { type: "Scooter", models: ["Segway E300", "Ninebot Max", "Silence S01"] },
    { type: "Micro-Car", models: ["Aixam City", "Ligier JS50", "Microcar MGO"] }
  ]

  let group = types[i % 4]
  let model = group.models[i % group.models.length]

  return {
    vehicle_id: "V" + String(i + 1).padStart(3, "0"),
    type: group.type,
    model: model,
    battery: Math.floor(Math.random() * 100),

    position: {
      lat: 45 + Math.random() * 10,
      lon: 9 + Math.random() * 10
    },

    extra_specs: {
      max_speed_kmh: 20 + Math.floor(Math.random() * 40)
    }
  }

})
)
```

---

## 3.3 RENTALS

### Schema logico

```js
{
  rental_id: String,
  user_id: String,
  vehicle_id: String,
  vehicle_type: String,
  start_time: Date,
  end_time: Date,
  route: [
    {
      lat: Number,
      lon: Number
    }
  ],
  total_cost: Number
}
```

### Inserimento dati (200 corse)

```js
db.rentals.insertMany(
Array.from({ length: 200 }).map((_, i) => {

  const types = ["Monopattino", "Bici Elettrica", "Scooter", "Micro-Car"]

  let start = new Date(
    2023,
    9,
    Math.floor(Math.random() * 30 + 1),
    Math.floor(Math.random() * 24)
  )

  return {
    rental_id: "R" + String(i + 1).padStart(4, "0"),
    user_id: "U" + String(Math.floor(Math.random() * 20 + 1)).padStart(3, "0"),
    vehicle_id: "V0" + String(Math.floor(Math.random() * 4 + 1)),
    vehicle_type: types[Math.floor(Math.random() * 4)],
    start_time: start,
    end_time: new Date(start.getTime() + Math.floor(Math.random() * 60) * 60000),

    route: Array.from({ length: 5 }).map(() => ({
      lat: 45 + Math.random(),
      lon: 9 + Math.random()
    })),

    total_cost: +(Math.random() * 10 + 1).toFixed(2)
  }

})
)
```
---
## 4. QUERY DI TEST

---

### 4.1 Veicoli con batteria inferiore al 20%

```js
db.vehicles.find(
  { battery: { $lt: 20 } },
  { vehicle_id: 1, type: 1, battery: 1, _id: 0 }
)
````

### Spiegazione

Questa query restituisce tutti i veicoli con batteria inferiore al 20%, utili per operazioni di ricarica.

---

### 4.2 Totale speso da un utente nell’ultimo mese

```js
db.rentals.aggregate([
  {
    $match: {
      user_id: "U001",
      start_time: {
        $gte: new Date("2023-09-30")
      }
    }
  },
  {
    $group: {
      _id: "$user_id",
      total_spent: { $sum: "$total_cost" }
    }
  }
])
```

### Spiegazione

La query filtra le corse dell’utente e somma il costo totale delle corse effettuate nell’ultimo mese.

---

### 4.3 Ultima corsa di un utente (coordinate GPS)

```js
db.rentals.find(
  { user_id: "U001" },
  { route: 1, start_time: 1, _id: 0 }
)
.sort({ start_time: -1 })
.limit(1)
```

### Spiegazione

Questa query restituisce l’ultima corsa effettuata dall’utente, utile per visualizzare il percorso su una mappa.

---

## 5. RELAZIONE FINALE – SCELTA TECNOLOGIA

MongoDB è stato scelto per lo sviluppo del progetto GreenWheel perché permette una gestione flessibile e scalabile dei dati.

A differenza dei database relazionali, non richiede schemi rigidi e consente di memorizzare strutture complesse come array e documenti annidati, fondamentali per rappresentare i percorsi GPS delle corse.

Inoltre MongoDB è particolarmente adatto per:

* dati dinamici e in continua evoluzione (nuovi tipi di veicoli)
* gestione di grandi quantità di eventi (200 corse e oltre)
* sistemi real-time di mobilità urbana
* scalabilità orizzontale del sistema

Per questi motivi MongoDB rappresenta la soluzione ideale per un’applicazione di car sharing moderna come GreenWheel.

---

## CONCLUSIONE

Il sistema GreenWheel è stato progettato con MongoDB per:

* gestire dati flessibili e scalabili
* rappresentare percorsi GPS complessi
* collegare utenti, veicoli e corse tramite ID
* simulare un sistema reale di car sharing

