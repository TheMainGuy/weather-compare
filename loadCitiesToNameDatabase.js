let cities = { data: [] }

var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('allCountries.txt')
})

lineReader.on('line', function (line) {
    let data = line.split('\t')
    let population = Number(data[14])
    if (population >= 10000) {
        let name = data[1]
        let lat = data[4]
        let lng = data[5]
        let country = data[8]
        city = {
            name: name,
            country: country,
            lat: lat,
            lng: lng
        }
        cities.data.push(city)
        /*
        db.run('INSERT INTO cities(name, country, lat, lng) VALUES(?, ?, ?, ?)', [name, country, lat, lng], function (err) {
            if (err) {
                return console.log(err.message);
            }
        })
        */
    }
})

lineReader.on('close', () => {
    require('fs').writeFile('allCities.json', JSON.stringify(cities), function (err) {
        if (err) {
            return log(err)
        }
    })
})