export default function handler(req, res) {
    const { city } = req.query
    res.end(`Post: ${city}`)
  }