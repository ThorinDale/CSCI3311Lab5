// CHART INIT ---------------------------------------------------------

// create svg with margin convention
const margin = ({top: 40, right: 40, bottom: 40, left: 40});

const width = 700 - margin.left - margin.right;
const height = 700 - margin.top - margin.bottom;
const svg = d3.select('.chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// create scales without domains
const xScale = d3.scaleBand()

const yScale = d3.scaleLinear()

// create axes and axis title containers
const xAxis = d3.axisBottom()
                .scale(xScale);
            
const yAxis = d3.axisLeft()
                .scale(yScale)
                .ticks(10);

svg.append('g')
    .attr('class', 'axis x-axis');

svg.append('g')
    .attr('class', 'axis y-axis');

svg.append('text')
    .attr('class', 'y-axis-title')
    .attr('x', -20)
    .attr('y', height/2 - margin.top)
    .attr('writing-mode', 'vertical-lr');
// (Later) Define update parameters: measure type, sorting direction

let type = document.querySelector('#group-by').value;
let direction = true;

let select = document.querySelector('#group-by');
let sort = document.querySelector('button');
select.addEventListener('change', function() {
    type = this.value;
    loadData(type);
});
sort.addEventListener('click', function() {
    direction = !direction;
    loadData(type);
})

// CHART UPDATE FUNCTION ----------------------------------------------

function update(data, type) {

    data.sort(function(a, b) {
        if (direction) {return b[type] - a[type];}
        else {return a[type] - b[type];}
    });

    // Update scale domains
    xScale.domain(data.map(d => d.company))
        .rangeRound([50, width+50])
        .paddingInner(0.01);

    yScale.domain([d3.max(data, d => d[type]), 0])
        .range([0, height]);

    const bars = svg.selectAll('rect')
        .data(data);

    // Implement the enter-update-exit sequence
    bars.enter()
        .append('rect')
        .merge(bars)
        .transition()
        .duration(1000)
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - yScale(d[type]))
        .attr('x', d => xScale(d.company))
        .attr('y', d => yScale(d[type]));

    // Update axes and axis title
    svg.select('.x-axis')
        .transition()
        .duration(1000)
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    svg.select('.y-axis')
        .transition()
        .duration(1000)
        .attr('transform', 'translate(' + 50 + ',0)')
        .call(yAxis);

    svg.select('.y-axis-title')
        .text(type);

    bars.enter().remove();

}

// update functions

// update bars


// CHART UPDATES ------------------------------------------------------

// loading data
d3.csv('coffee-house-chains.csv', d3.autoType).then(data => {
    update(data, type);
});

// (Later) Handling the type change
function loadData(type) {
    d3.csv('coffee-house-chains.csv', d3.autoType).then(data => {
        update(data, type);
    });
}

// (Later) Handling the sorting direction change