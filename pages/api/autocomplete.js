const csv = require("csvtojson")

let cities = {}
let init = false

export default async function handler(req, res) {
    if (!init) {
        init = true
        try {
            cities = await csv().fromFile('../../worldcities.csv')
        } catch (error) {
            res.status(500).end('Error')
            return
        }
    }

    let name = req.query.name
    if (name.length <= 2) {
        res.status(400).end('')
        return
    }
    let json = {
        data: {
            matches: []
        }
    }
    for (var index in cities) {
        let entry = cities[index]
        if (entry.city.toString().toLowerCase().startsWith(name.toString().toLowerCase())) {
            let match = {}
            match.city = entry.city
            match.country = entry.country
            match.id = entry.city + '_' + entry.lat + '_' + entry.lng
            json.data.matches.push(match)
        }
    }
    res.status(200).json(json)
}