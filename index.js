/* 
global d3
*/
//Playing around with d3.js, see https://square.github.io/intro-to-d3
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


d3.select('body')
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
/*
var maxCount = d3.max(sales, function(d, i) {
  return d.count;
});
*/
var maxCount = d3.max(sales, d => d.count);

var x = d3.scaleLinear()
  .range([0, 300])
  .domain([0, maxCount]);

var y = d3.scaleBand()
    .rangeRound([0, 75])
    .domain(sales.map(d => d.product));

newRects.append('rect')
  .attr('x', x(0))
  .attr('y', d => y(d.product))
  .attr('height', y.bandwidth())
  .attr('width', d => x(d.count));

var oldsales = JSON.parse(JSON.stringify(sales));
sales.pop();
//the following line does not work for me
const rects2 = rects.data(sales);
//rects = svg.selectAll('rect').data(sales);
var rectsToRemove = rects2.exit();
rectsToRemove.remove(); 



d3.select('body')
    .append('br');
    
//3rd example: transitions
var days = [];
days[0] = oldsales;
var newcounts = [16, 7, 8];
var newsales = JSON.parse(JSON.stringify(oldsales));
/*
newsales[0]['count'] = 16;
newsales[1]['count'] = 7;
newsales[2]['count'] = 8;
*/
[16, 7, 8].forEach((d,i) => newsales[i]['count'] = d);
days[1] = newsales;
sales = days[0];

function toggle() {
  sales = (sales == days[0]) ? days[1] : days[0];
  update();
}

function update() {
  var rects = svg.selectAll('rect')
    .data(sales, d => d.product);

  // When we enter, we add the DOM element
  // and set up the things that won't change
  var enterRects = rects.enter()
  /*
    .append('rect')
      .attr('x', x(0))
      .attr('y', d => y(d.product))
      .attr('height', y.bandwidth())
  */
    ;

  // "rects" represents the update selection, we need to
  // manually merge it with the enter selection to update
  // all rects at the same time
  rects.merge(enterRects)
    .transition()
    .duration(1000)
    .attr('width', d => x(d.count))
    .attr('fill', 'red')
  ;
};

var toggleButton = d3.select('body')
  .append('button')
  .attr('onClick', 'toggle()')
  .text('toggle')
  ;