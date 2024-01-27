import { SITEMAP_XML } from '@library/constant';
import { Request, Response } from '@library/type';

export default function (request: Request, response: Response): void {
	response.setHeader('Content-Type', 'application/xml');
	response.send(SITEMAP_XML);

	return;
}