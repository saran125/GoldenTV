import Https   from 'https';
import FileSys from 'fs';

/**
 * Setup Https server for express
 * @param {import('express').Application} express 
 * @returns {Https.Server}
 */
export function initialize_https(express) {
	const key         = FileSys.readFileSync(`${process.cwd()}/key.pem`);
	const cert        = FileSys.readFileSync(`${process.cwd()}/cert.pem`);
	const ServerHttps = Https.createServer({key: key, cert: cert }, express);

	console.log(`Initialized Https Certification`);
	return ServerHttps;
}