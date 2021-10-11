const csv = require("csvtojson")

let cities = {}
let init = false

export default async function handler(req, res) {
    if (!init) {
        init = true
        cities = await csv().fromFile('worldcities.csv')
    }
    let name = req.query.name
    let json = {
        data: {
            matches: []
        }
    }
    for (var index in cities) {
        let entry = cities[index]
        if (entry.city.startsWith(name)) {
            let match = {}
            match.city = entry.city
            match.country = entry.country
            match.id = entry.lat + "_" + entry.lng
            json.data.matches.push(match)
        }
    }
    res.status(200).json(json)
}