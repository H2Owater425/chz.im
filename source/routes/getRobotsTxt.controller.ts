import { Request, Response } from '@library/type';

export default function (request: Request, response: Response): void {
	response.send('User-agent: *\nAllow: /$\nAllow: /favicon.ico\nAllow: /ogImage.png\nDisallow: /');

	return;
}