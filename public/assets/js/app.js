var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    g = svg.append("g").attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

var stratify = d3.stratify()
    .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

var tree = d3.tree()
    .size([2 * Math.PI, 500])
    .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });


var tau = 2 * Math.PI;
var segmentWidth = 80;
var segmentMargin = 1;
var depthColor = ['green', 'red', 'gray', 'blue', 'black'];

function name(id) {
	return id.substring(id.lastIndexOf(".") + 1);
}

function segment(parent, start, stop) {
	if (parent !== undefined) {
		var depth = parent.depth;
		var isRoot = depth === 0;
		var arc = d3.arc()
			.innerRadius(depth*segmentWidth)
			.outerRadius((depth+1)*segmentWidth - segmentMargin)
			.cornerRadius(10)
			.startAngle(start*tau)
			.endAngle(stop*tau)
			.padAngle(0.005);
		
		var centroid = arc.centroid();
		
		g.append("path")
	    	.style("fill", 'darkcyan')
	    	.style("fill-opacity", 1 - depth/5)
	    	.attr("d", arc);

		var rotDeg = isRoot ? 0 : (stop + start)/2*360 + 180;

		var textGroup = g.append('g')
			.attr("transform", "rotate(" + rotDeg + "," + centroid[0] + "," + centroid[1] + ")")
			
		textGroup.append('text')
			.attr('x', isRoot ? 0 : centroid[0])
		 	.attr('y', isRoot ? 0 : centroid[1])
			.attr('dy', '-0.5em')
			.text(name(parent.id));
		textGroup.append('text')
			.attr('x', isRoot ? 0 : centroid[0])
		 	.attr('y', isRoot ? 0 : centroid[1])
			.attr('dy', '0.5em')
			.text(parent.data.birth + " - " + parent.data.dead || "    " );


		var children = parent.children;
		if (children !== undefined && children !== null && children.length > 0) {
			var range = (stop-start)/children.length;
			children.forEach(function (c, idx) {
				segment(c, start + idx*range, start + (idx+1)*range);
			})
		}
	}
}

d3.csv("assets/data/test-data.csv", function(error, data) {
  if (error) throw error;

  var root = tree(stratify(data));
  segmentWidth = height/(root.height + 1)/2;
  var nrChildren = root.children.length;

  segment(root, 0, 1)
});

function radialPoint(x, y) {
  return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
}