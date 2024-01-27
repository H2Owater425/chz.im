import { Transaction, UpdateResult, sql } from 'kysely';
import { getKeys, kysely, redis } from '@library/database';
import { resolveInSequence } from '@library/utility';
import { Database } from '@library/type';
import Logger from '@library/logger';

global.setInterval(function (): void {
	const startTime: number = Date.now();
	const keys: string[] = [];
	const ids: number[] = [];

	getKeys('link:*')
	.then(function (_keys: Set<string>): Promise<(string | null)[]> | [] {
		if(_keys['size'] !== 0) {
			for(const key of _keys) {
				keys.push(key);
				ids.push(Number(key.slice(5)));
			}
	
			return redis.mget(keys);
		} else {
			return [];
		}
	})
	.then(function (results: (string | null)[]): Promise<[bigint, number]> | [bigint, number] {
		if(results['length'] !== 0) {
			return resolveInSequence<[bigint, number]>([kysely.transaction()
			.setIsolationLevel('serializable')
			.execute(function (transaction: Transaction<Database>): Promise<UpdateResult[]> {
				const updatePromises: Promise<UpdateResult>[] = [];
	
				for(let i: number = 0; i < results['length']; i++) {
					if(results[i] !== null) {
						updatePromises.push(transaction.updateTable('link')
						.set({
							visited_count: sql.raw('visited_count + ' + results[i])
						})
						.where('id', '=', ids[i])
						.executeTakeFirstOrThrow());
					}
				}
	
				return resolveInSequence(updatePromises);
			})
			.then(function (results: UpdateResult[]): bigint {
				let count: bigint = 0n;
				
				for(let i: number = 0; i < results['length']; i++) {
					count += results[i]['numUpdatedRows'];
				}
	
				return count;
			}), redis.unlink(keys)]);
		} else {
			return [0n, 0];
		}
	})
	.then(function (results: [bigint, number]): void {
		if(results[0] !== 0n && results[1] !== 0) {
			Logger['logger'].debug(results[0] + ' rows have been updated, and ' + results[1] + ' views have been unlinked (' + (Date.now() - startTime) + 'ms)');
		}

		return;
	})
	.catch(Logger['logger'].error);

	return;
}, 600000);