let cities = { data: [] }

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('Data/allCountries.txt'),
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
      lng: lng,
      population: population,
    }
    cities.data.push(city)
  }
})

lineReader.on('close', () => {
  require('fs').writeFile(
    'Data/allCities.json',
    JSON.stringify(cities),
    function (err) {
      if (err) {
        return log(err)
      }
    }
  )
})
