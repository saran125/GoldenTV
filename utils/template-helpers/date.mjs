import Moment from 'moment';
export const formatters_date = {
	"format_date": format_date
};

/**
 * Formats a date object into specified format string
 * @param {Date} date The date and time object
 * @param {string} format The format string
 * @returns {string} The formatted date and time
 */
function format_date(date, format) {
	return Moment(date).format(format);
}

