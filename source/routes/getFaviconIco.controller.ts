import { FAVICON_ICO } from '@library/constant';
import { Request, Response } from '@library/type';

export default function (request: Request, response: Response): void {
	response.setHeader('Content-Type', 'image/x-icon');
	response.setHeader('Content-Length', FAVICON_ICO['byteLength']);
	response.setHeader('Access-Control-Allow-Origin', '*');
	response.write(FAVICON_ICO);
	response.end();
	response['server']['logger'].info(response['request']['ip'] + ' "' + response['request']['method'] + ' ' + decodeURIComponent(response['request']['url']) + ' HTTP/' + response['request']['httpVersion'] + '" ' + response['statusCode'] + ' "' + response['request']['headers']['user-agent'] + '" (' + (Date.now() - response['request']['startTime']) + 'ms)');

	return;
}