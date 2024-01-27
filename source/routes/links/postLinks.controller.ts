import { kysely } from '@library/database';
import { BadRequest, Conflict } from '@library/error';
import { Channel, Database, Link, Request, Response } from '@library/type';
import { getChannel, getEncryptedPassword } from '@library/utility';
import { Transaction } from 'kysely';

export default function (request: Request<{
	body: Pick<Link, 'handle' | 'target' | 'password'>;
}>, response: Response): Promise<void> {
	return kysely.transaction()
	.setIsolationLevel('serializable')
	.execute(function (transaction: Transaction<Database>): Promise<void> {
		return transaction.selectFrom('link')
		.select(['id'])
		.where('handle', '=', request['body']['handle'])
		.executeTakeFirst()
		.then(function (link?: Pick<Link, 'id'>): Promise<Channel | undefined> {
			if(typeof(link) === 'undefined') {
				return getChannel(request['body']['target']);
			} else {
				throw new Conflict('Body[\'handle\'] must be unique');
			}
		})
		.then(function (channel?: Channel): Promise<string> {
			if(typeof(channel) !== 'undefined') {
				return getEncryptedPassword(request['body']['password'], request['body']['handle']);
			} else {
				throw new BadRequest('Body[\'target\'] must be valid');
			}
		})
		.then(function (encryptedPassword: string): Promise<Pick<Link, 'id' | 'createdAt'>> {
			return transaction.insertInto('link')
			.values({
				handle: request['body']['handle'],
				target: request['body']['target'],
				password: encryptedPassword
			})
			.returning(['id', 'created_at as createdAt'])
			.executeTakeFirstOrThrow();
		})
		.then(function (link: Pick<Link, 'id' | 'createdAt'>): void {
			response.send({
				id: link['id'],
				handle: request['body']['handle'],
				target: request['body']['target'],
				visitedCount: 0,
				createdAt: link['createdAt']
			} satisfies Pick<Link, 'id' | 'handle' | 'target' | 'visitedCount' | 'createdAt'>);

			return;
		})
	});
}