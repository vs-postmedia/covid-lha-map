// CSS
import normalize from './css/normalize.css';
import colours from './css/colors.css';
import fonts from './css/fonts.css';
import css from './css/main.css';

// JS
// import axios from 'axios';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import * as SpikeMap from './js/spike-map.js';


// DATA
// import config from './data/config.json';
import lha from './data/BCHA_LOCAL_HEALTH_AREA_SP.json';
import cases_raw from './data/cases.json';

const init = async () => {
	// const path = d3.geoPath();
	// map geo features to their LHA code
	// const features = new Map(topojson.feature(lha, lha.objects.BCHA_LOCAL_HEALTH_AREA_SP).features.map(d => [d.properties.LOCAL_HLTH_AREA_CODE, d]));



	// const cases = cases_raw.map(d => {
	// 	// get the geo feature for each LHA
	// 	const feature = features.get(d.LHA_CD.toString());
	// 	console.log(feature)
	// 	return {
	// 		lha_code: d.LHA_CD,
	// 		name: d.LHA_Name,
	// 		position: feature && path.centroid(feature),
	// 		value: +d.per_100k
	// 	}
	// });

	// console.log(cases)
	SpikeMap.init(lha, cases_raw);
};

init();