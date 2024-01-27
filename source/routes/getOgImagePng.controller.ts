import { OG_IMAGE_PNG } from '@library/constant';
import { Request, Response } from '@library/type';

export default function (request: Request, response: Response): void {
	response.setHeader('Content-Type', 'image/png');
	response.setHeader('Content-Length', OG_IMAGE_PNG['byteLength']);
	response.setHeader('Access-Control-Allow-Origin', '*');
	response.write(OG_IMAGE_PNG);
	response.end();
	response['server']['logger'].info(response['request']['ip'] + ' "' + response['request']['method'] + ' ' + decodeURIComponent(response['request']['url']) + ' HTTP/' + response['request']['httpVersion'] + '" ' + response['statusCode'] + ' "' + response['request']['headers']['user-agent'] + '" (' + (Date.now() - response['request']['startTime']) + 'ms)');

	return;
}