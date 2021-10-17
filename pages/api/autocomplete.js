import getConfig from 'next/config'

let { serverRuntimeConfig } = getConfig()

let cities = serverRuntimeConfig.cityNames
export default async function handler(req, res) {

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
        if (entry.name.toString().toLowerCase().startsWith(name.toString().toLowerCase())) {
            let match = {}
            match.city = entry.name
            match.country = entry.country
            match.id = entry.city + '_' + entry.lat + '_' + entry.lng
            json.data.matches.push(match)
        }
    }
    res.status(200).json(json)
}