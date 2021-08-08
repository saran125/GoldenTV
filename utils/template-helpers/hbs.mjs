// const moment = require('moment');

/**
 * This file contains the implementation of commonly used operators within handlebars
 * @file operators.mjs
 */

export const Check = {
	"radioCheck": radioCheck,
	"prevImage": prevImage
}

// formatDate: function(date, targetFormat){
// 	return moment(date).format(targetFormat);
// }

/** Check Radio Value */
function radioCheck(value, radioValue) {
	if (value === radioValue){
		return 'checked';
	}
	return '';
}

function prevImage(value, newValue) {
	if (newValue === ""){
		return value;
	}
	else {
		return newValue;
	}
}