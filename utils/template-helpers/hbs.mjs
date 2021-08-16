// const moment = require('moment');

/**
 * This file contains the implementation of commonly used operators within handlebars
 * @file operators.mjs
 */

export const Check = {
	"radioCheck": radioCheck,
	"Countdown": Countdown
}

// formatDate: function(date, targetFormat){
// 	return moment(date).format(targetFormat);
// }

/** Check Radio Value */
function radioCheck(value, radioValue) {
	if (value === radioValue) {
		return 'checked';
	}
	return '';
}

function Countdown(image, value) {
	// Time calculations for days, hours, minutes and seconds
	var days = Math.floor(value / (1000 * 60 * 60 * 24));
	var hours = Math.floor((value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	var minutes = Math.floor((value % (1000 * 60 * 60)) / (1000 * 60));

	if (image == "No-Image-PlaceHolder.png") {
		return "Coming soon~";
	}

	if (value > 0) {
		return "Out in " + days + " d " + hours + "h " + minutes + "m";

	}
	else {
		// Display the result in the element with id="demo"
		return 'Out Now!';
	}
}

