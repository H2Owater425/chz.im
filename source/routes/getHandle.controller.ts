import { CHZZK_BASE_URL, HANDLE_HTML } from '@library/constant';
import { kysely, redis } from '@library/database';
import { Channel, Database, Link, Request, Response } from '@library/type';
import { getChannel } from '@library/utility';
import { SelectQueryBuilder } from 'kysely';

export default function (request: Request<{
	parameter: Pick<Link, 'handle'>;
}>, response: Response): Promise<void> {
	const isInformation: boolean = request['parameter']['handle'].endsWith('+');

	if(isInformation) {
		request['parameter']['handle'] = request['parameter']['handle'].slice(0, -1);
	}

	return kysely.selectFrom('link')
	.select(['id', 'target'])
	.$if(isInformation, function (queryBuilder: SelectQueryBuilder<Database, 'link', Pick<Link, 'id' | 'target'>>): SelectQueryBuilder<Database, 'link', Pick<Link, 'id' | 'target' | 'visitedCount' | 'createdAt'>> {
		return queryBuilder
		.select(['visited_count as visitedCount', 'created_at as createdAt']);
	})
	.where('handle', '=', request['parameter']['handle'])
	.executeTakeFirst()
	.then(function (link?: Pick<Link, 'id' | 'target'> & Partial<Pick<Link, 'visitedCount' | 'createdAt'>> | Pick<Link, 'id' | 'target' | 'visitedCount' | 'createdAt'>): Promise<void> | void {
		if(typeof(link) !== 'undefined') {
			if(!isInformation) {
				response.redirect(CHZZK_BASE_URL + link['target']);
				redis.incr('link:' + link['id'])
				.then(response['server']['logger'].info);

				return;
			} else {
				return getChannel(link['target'])
				.then(function (channel?: Channel): void {
					if(typeof(channel) !== 'undefined') {
						response.setHeader('Content-Type', 'text/html');
						response.send(HANDLE_HTML.replace('{openLiveStyle}', channel['openLive'] ? ' style="background-color: #f5fef5"' : '').replace('{channelImageElement}', channel['channelImageUrl'] !== null ? '<img src="' + channel['channelImageUrl'] + '">' : '').replace('{target}', link['target']).replace('{channelName}', channel['channelName']).replace('{channelDescription}', channel['channelDescription']).replace('{followerCount}', channel['followerCount'] as unknown as string).replace('{visitedCount}', link['visitedCount'] as unknown as string).replace('{createdAt}', (link['createdAt'] as Date).toISOString()));
					} else {
						response.redirect(CHZZK_BASE_URL);
					}

					return;
				});
			}
		} else {
			return getChannel(request['parameter']['handle'])
			.then(function (channel?: Channel): void {
				response.redirect(CHZZK_BASE_URL + (typeof(channel) !== 'undefined' ? request['parameter']['handle'] : ''));

				return;
			});
		}
	});
}