<template>
  <div id="dashboard" class="dashboard">
    <div id="map" class="map"></div>
    <histogram :data="history" class="histogram"></histogram>
    <div class="detail">
      <h1>Ship: {{shipName}}</h1>
      <h4>Current Speed: {{speed}}</h4>
      <button class="button" v-on:click="showAllMarkers()">Show all previous locations</button>
    </div>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers'
import 'leaflet.heat/dist/leaflet-heat'
import API from '../services/api'

export default {
  name: 'about',
  data () {
    return {
      shipName: null,
      speed: null,
      history: null,
      markers: [],
      map: null,
      heat: null,
      images: ['00005276', '00005277', '00005278', '00005279', '00005280', '00005281', '00005282', '00005283'],
      zoom: 14,
      center: [51.026, -1.397],
      url: 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW5uYWV0IiwiYSI6ImNpcXdkeTFhdzAwMnBodG5qZnhsa3pwNzgifQ.sLCy6WaD4pURO1ulOFoVCg',
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'
    }
  },
  created () {
  },
  mounted () {
    this.setUpMap()
    this.getShips()
  },
  methods: {
    showAllMarkers () {
      let lastLatLng
      for (let markerId in this.markers) {
        let marker = this.markers[markerId]
        marker.remove()
        marker.addTo(this.map)
        lastLatLng = marker._latlng
      }
      this.map.setView(lastLatLng, this.zoom)
    },
    getShips () {
      API.getShipHistory().then(response => {
        this.history = response.body.hits.hits
        this.shipName = this.history[0]._source.shipName
        this.speed = this.history[this.history.length - 1]._source.speed

        for (let state of this.history) {
          this.createMarker({
            lat: state._source.geoip.location.lat,
            lon: state._source.geoip.location.lon,
            name: state._id,
            icon: 'ship',
            colour: 'blue'
          })
        }
      })
    },
    createMarker (json) {
      var position = [json.lat, json.lon]

      if (this.markers[json.name]) {
        this.markers[json.name].setLatLng(position)
      } else {
        var marker = L.AwesomeMarkers.icon({
          icon: json.icon,
          prefix: 'fa',
          markerColor: json.colour
        })

        this.markers[json.name] = L.marker(position, {
          icon: marker
        }).addTo(this.map)
      }
      this.map.setView(position, this.zoom)
    },
    createHeatMap (latlngs) {
      this.heat = L.heatLayer(latlngs, {
        radius: 25,
        minOpacity: 0.3
      }).addTo(this.map)
    },
    setUpMap () {
      this.map = L.map('map').setView(this.center, this.zoom)

      L.tileLayer(this.url, {
        attribution: this.attribution,
        maxZoom: 18
      }).addTo(this.map)
    }
  }
}
</script>

<!-- styling for the component -->
<style lang='scss' scoped>
@import "~leaflet/dist/leaflet.css";
@import "~leaflet.awesome-markers/dist/leaflet.awesome-markers.css";
@import "~font-awesome/css/font-awesome.css";

@import '../assets/settings.scss';

#dashboard {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $primary-color;
  height: 100%;

  .map {
    height: 50%;
  }

  .histogram {
    width: 50%;
  }

  .detail {
    width: 50%;
    float: right;
  }
}
</style>
