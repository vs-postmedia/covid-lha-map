import * as d3 from 'd3-time-format';
import css from './tooltip-template.css';
import helper from '../../js/helper-functions';

const formatTime = d3.timeFormat('%B %d, %Y');

function tooltip(d) {
	const template = `
		<div class="tooltip-content">
			<h4>${d.name}</h4>
			<p><span class="blue">${d.value}</span> cases per 100,000</p>
		</div>
	`;

	return template;
};

export default tooltip;

