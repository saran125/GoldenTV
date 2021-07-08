import moment from 'moment';

export function replaceCommas(str) {
    if (str != null || str.length !== 0) {
        if (str.trim().length !== 0) {
            // uses pattern-matching string /,/g for ','
            return str.replace(/,/g, ' | ');
        }
    }
    return 'None';
}
export function formatDate(date, targetFormat) {
    return moment(date).format(targetFormat);
}
export function radioCheck(value, radioValue) {
    if (value === radioValue) {
        return 'checked';
    }
    return '';
}