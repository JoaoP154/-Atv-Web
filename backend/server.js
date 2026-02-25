const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, '../frontend')))

let items = []

app.get('/api/products', (req, res) => {
  res.json(items)
})

app.post('/api/products', (req, res) => {
  const { name, category, description, price, imageUrl } = req.body

  if (!name || !category) {
    return res.status(400).json({ error: 'Name and category are required' })
  }

  const newItem = {
    id: Date.now().toString(),
    name,
    category,
    description: description || '',
    price: price || 0,
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    createdAt: new Date().toISOString()
  }

  items.push(newItem)
  res.status(201).json(newItem)
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${3000}`)
})
