import { Request, Response } from '@library/type';

export default function (request: Request, response: Response): void {
	response.send('Contact: mailto:me@kangmin.kim\nContact: mailto:support@chz.im\nExpires: ' + ((new Date()).getFullYear() + 1) + '-01-01T00:00:00.000Z\nPreferred-Languages: ko, en\nCanonical: https://chz.im/.well-known/security.txt');

	return;
}