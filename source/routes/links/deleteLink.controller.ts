import { kysely } from '@library/database';
import { BadRequest, NotFound, Unauthorized } from '@library/error';
import { Database, Link, Request, Response } from '@library/type';
import { getEncryptedPassword } from '@library/utility';
import { DeleteResult, Transaction } from 'kysely';

export default function (request: Request<{
	parameter: Pick<Link, 'handle'>;
	body: Pick<Link, 'password'>;
}>, response: Response): Promise<void> {
	return kysely.transaction()
	.setIsolationLevel('serializable')
	.execute(function (transation: Transaction<Database>): Promise<void> {
		return transation.selectFrom('link')
		.select(['id', 'password'])
		.where('handle', '=', request['parameter']['handle'])
		.executeTakeFirst()
		.then(function (link?: Pick<Link, 'id' | 'password'>): Promise<DeleteResult> {
			if(typeof(link) !== 'undefined') {
				return getEncryptedPassword(request['body']['password'], request['parameter']['handle'])
				.then(function (encryptedPassword: string): Promise<DeleteResult> {
					if(encryptedPassword === link['password']) {
						return kysely.deleteFrom('link')
						.where('id', '=', link['id'])
						.executeTakeFirstOrThrow();
					} else {
						throw new Unauthorized('Body[\'password\'] must be valid');
					}
				});
			} else {
				throw new NotFound('Parameter[\'handle\'] must be valid');
			}
		})
		.then(function (result: DeleteResult): void {
			if(result['numDeletedRows'] === 1n) {
				response.setStatus(204);
				response.send();

				return;
			} else {
				throw new NotFound('Parameter[\'handle\'] must be valid');
			}
		});
	});
}