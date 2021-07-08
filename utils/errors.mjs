
/**
 * A simple HTTP error representation
 */
export class HttpError extends Error {
	/**
	 * Constructor for Http Errors
	 * @param {number} code 
	 * @param {string} message 
	 */
	constructor(code, message) {
		super(message);
		this.name = "HttpError";
		this.code = code;
	}
}