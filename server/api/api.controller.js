const request = require('request')

let getHistory = (req, res) => {
  console.log('get history')
  request({
    method: 'POST',
    url: 'http://192.168.50.155:9200/logstash*/_search',
    body: {
      'size' : 20,
      'query': { 'match': { 'broadcastMmsi': 226230000 } }
    },
    json: true
  }, (err, response, body) => {
    console.log(body)
    if (err) {
      console.log(err)
      res.status(500).send({ error: err })
      return
    }

    res.send(body)
  })
}

module.exports = {
  getHistory: getHistory
}
