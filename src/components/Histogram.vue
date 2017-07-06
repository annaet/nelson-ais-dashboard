<template>
  <svg id="histogram" width="600" height="400"></svg>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'histogram',
  props: ['data'],
  data () {
    return {
      hello: 'hello world'
    }
  },
  watch: {
    data: function () {
      this.buildHistogram()
    }
  },
  methods: {
    buildHistogram () {
      var formatCount = d3.format(',.0f')
      let boundingBox = d3.select('#histogram').node().getBoundingClientRect()

      var svg = d3.select('svg')
      var margin = {top: 10, right: 30, bottom: 30, left: 30}
      var width = +boundingBox.width - margin.left - margin.right
      var height = +boundingBox.height - margin.top - margin.bottom
      var g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      var x = d3.scaleLinear()
          .domain([0, 11])
          .rangeRound([0, width])

      var bins = d3.histogram()
          .value(function (d) {
            return d._source.speed
          })
          .domain(x.domain())
          .thresholds(x.ticks(10))(this.data)

      var y = d3.scaleLinear()
          .domain([0, d3.max(bins, function (d) { return d.length })])
          .range([height, 0])

      let update = (bins) => {
        var t = d3.transition()
            .duration(750)

        // JOIN new data with old elements.
        var group = g.selectAll('.bar')
            .data(bins)

        // EXIT old elements not present in new data.
        group.exit()
            .transition(t)
            .attr('height', 0)
            .attr('y', function (d) {
              return height - y(d.length)
            })
            .remove()

        // UPDATE old elements present in new data.
        group.attr('class', 'update')
            .transition(t)
            .attr('height', function (d) {
              return height - y(d.length)
            })

        // ENTER new elements present in new data.
        var bar = group.enter().append('g')
            .attr('class', 'enter')
            .attr('class', 'bar')
            .attr('transform', function (d) { return 'translate(' + x(d.x0) + ',' + y(d.length) + ')' })
            .on('mousedown', d => {
              let ids = d.map(state => {
                return state._id
              })

              let lastLatLng
              for (let markerId in this.markers) {
                let marker = this.markers[markerId]
                marker.remove()
                if (ids.indexOf(markerId) > -1) {
                  marker.addTo(this.map)
                  lastLatLng = marker._latlng
                }
              }
              this.map.setView(lastLatLng, this.zoom)
            })

        bar.append('rect')
            .attr('x', 1)
            .attr('width', x(bins[0].x1) - x(bins[0].x0) - 1)
            .attr('height', 0)
            .attr('y', function (d) {
              return height - y(d.length)
            })
            .style('fill', 'steelblue')
            .transition(t)
            .attr('height', function (d) {
              return height - y(d.length)
            })
            .attr('y', 0)

        bar.append('text')
            .attr('dy', '.75em')
            .attr('y', 6)
            .attr('x', (x(bins[0].x1) - x(bins[0].x0)) / 2)
            .attr('text-anchor', 'middle')
            .text(function (d) { return formatCount(d.length) })
            .style('fill', '#fff')
            .style('font', '10px sans-serif')
      }

      update(bins)

      g.append('g')
          .attr('class', 'axis axis--x')
          .attr('transform', 'translate(0,' + height + ')')
          .call(d3.axisBottom(x))
    }
  }
}
</script>

<!-- styling for the component -->
<style lang='scss' scoped>
</style>
