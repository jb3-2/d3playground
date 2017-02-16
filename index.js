/* 
Playing around with d3.js, see https://square.github.io/intro-to-d3

global d3
*/

// first example: domains, scales, axes

var numbers = [ 5, 4, 10, 1 ],
    data = [
      { date: '2014-01-01', amount: 10 },
      { date: '2014-02-01', amount: 20 },
      { date: '2014-03-01', amount: 40 },
      { date: '2014-04-01', amount: 80 }
    ];

var y = d3.scaleLinear()
    //.domain(d3.extent(data, function(d){return d.amount}))
    .domain([0, 80])
    .range([200, 0]);


var x = d3.scaleTime()
    .domain([
      new Date(Date.parse('2014-01-01')),
      new Date(Date.parse('2014-04-01'))
    ])
    .range([0, 300]);

var xAxis = d3.axisBottom(x)
    .ticks(4);
    
var svg = d3.select('body')
  .append('svg')        // create an <svg> element
    .attr('width', 300) // set its dimentions
    .attr('height', 150);

svg.append('g')            // create a <g> element
  .attr('class', 'x axis') // specify classes
  .call(xAxis);            // let the axis do its thing


var linebreak = d3.select('body')
    .append('br');

//Second example: data binding (some code changed due to changes in v4)
var sales = [
  { product: 'Hoodie',  count: 7 },
  { product: 'Jacket',  count: 6 },
  { product: 'Snuggie', count: 9 },
];

var svg = d3.select('body')
  .append('svg');
var rects = svg.selectAll('rect')
    .data(sales);
var newRects = rects.enter();

var maxCount = d3.max(sales, function(d, i) {
  return d.count;
});

var x = d3.scaleLinear()
  .range([0, 300])
  .domain([0, maxCount]);

var y = d3.scaleBand()
    .rangeRound([0, 75])
    .domain(sales.map(function(d, i) {
        return d.product;
    }));

newRects.append('rect')
  .attr('x', x(0))
  .attr('y', function(d, i) {
    return y(d.product);
  })
  .attr('height', y.bandwidth())
  .attr('width', function(d, i) {
    return x(d.count);
  });


sales.pop();
//the following line does not work for me
//rects = rects.data(sales);
rects = svg.selectAll('rect').data(sales);
var rectsToRemove = rects.exit();
rectsToRemove.remove(); 

