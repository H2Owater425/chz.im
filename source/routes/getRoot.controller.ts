import { INDEX_HTML } from '@library/constant';
import { Request, Response } from '@library/type';

export default function (request: Request, response: Response): void {
	response.setHeader('Content-Type', 'text/html');
	response.send(INDEX_HTML);

	return;
}