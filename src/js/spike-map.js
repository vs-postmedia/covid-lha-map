import * as d3 from 'd3';
import Popup from '@flourish/popup';
import * as topojson from 'topojson-client';
import TooltipTemplate from '../components/TooltipTemplate/tooltip-template';

// vars
let path, svg;
const height = 500;
const width = 500;
const spikeWidth = 7;

const init = async (json, data_raw) => {
	const app = document.querySelector('#app');

	// setup projection & path generator
	const projection = d3.geoAlbers()
		.rotate([121, -11])
		.scale([2000])
		.translate([width / 1.6, height / 1.2]);

	// path to parse the topojson
	path = d3.geoPath()
		.projection(projection);


	// create features lookup (by id)
	const features = new Map(
		topojson
			.feature(json, json.objects.BCHA_LOCAL_HEALTH_AREA_SP).features
			.map(d => [d.properties.LOCAL_HLTH_AREA_CODE, d])
	);

	const data = data_raw.map(d => {
		// get the geo feature for each LHA
		const feature = features.get(d.LHA_CD.toString());
		return {
			lha_code: d.LHA_CD,
			name: d.LHA_Name,
			position: feature && path.centroid(feature),
			value: +d.per_100k // key needs to be "value"
		}
	});

	// draw the map		
	let map = await createBaseMap(json);
	map = await addSpikes(map, data);
	map = await addInteractivity(map);

	// add the map to the DOM
	app.append(map.node())
}

function addInteractivity(svg) {
	const popup = Popup();

	svg.selectAll('.spike')
		.on('mouseover', (d,e) => {
			console.log(d)
			// get xy coordinates
			const x = d3.event.pageX, y = d3.event.pageY;
			// Draw the popup pointing to position (100, 100)
			popup
				.point(x, y)
				.container(document.querySelector('#app'))
				.html(TooltipTemplate(d))
				.draw();
		})
		.on('mouseout', d => popup.hide());

	return svg;
}

function addSpikes(svg, data) {
	const setLength = d3.scaleLinear([0, d3.max(data, d => d.value)], [0, 200]);

	svg.append('g')
		.attr('fill', 'steelblue')
		.attr('fill-opacity', 0.3)
		.attr('stroke', 'steelblue')
		.attr('class', 'spikes')
		.selectAll('path')
			.data(data
				.filter(d => d.position)
				.sort((a,b) => d3.ascending(a.position[1], b.position[1]) || d3.ascending(a.position[0], b.position[0]))
			)
			.join('path')
				.attr('class', 'spike')
				.attr('transform', d => `translate(${d.position})`)
				.attr('d', d => drawSpike(setLength(d.value), spikeWidth));

	return svg;
}

function createBaseMap(json) {
	// setup svg
	svg = d3.create('svg')
		.attr('viewBox', [ 0, 0, height, width]);


	svg.append('path')
		.datum(topojson.feature(json, json.objects.BCHA_LOCAL_HEALTH_AREA_SP))
		.attr('class', 'regions')
		.attr('fill', '#EAEBEC')
		.attr('stroke', '#FFF')
		.attr('stroke-linejoin', 'round')
		.attr('d', path)
		;

	return svg;
}

function drawSpike(length, spikeWidth) {
	return `M${-spikeWidth / 2},0L0,${-length}L${spikeWidth / 2},0`;
}


export { init };