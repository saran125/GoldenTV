/**
 * This file consolidates all the template helpers that would be used
 * for handlebars rendering engine to provide basic conveniences.
 * @file 
 */
import { operators }       from './operators.mjs';
import { formatters_date } from './date.mjs';

/**
 * Consolidation of all template helpers for handlebars
 */
export const template_helpers = Object.assign({},
	operators, 
	formatters_date
);
export default template_helpers;