const moment = require('moment');

/**
 * This file contains the implementation of commonly used operators within handlebars
 * @file operators.mjs
 */

export const check = {
	"radioCheck": radioCheck
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
