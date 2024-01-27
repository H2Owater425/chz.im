
import { Database } from '@library/type';
import { Kysely, PostgresDialect } from 'kysely';
import Logger from './logger';
import { Redis } from 'ioredis';
import { Pool } from 'pg';

export const kysely: Kysely<Database> = new Kysely<Database>({
	dialect: new PostgresDialect({
		pool: new Pool({
			connectionString: process['env']['DATABASE_URL'],
			options: "-c search_path=chz_im"
		})
	})
});

export const redis: Redis = new Redis(process['env']['CACHE_DATABASE_URL'])
.on('error', function (error: Error): void {
	switch((error as Error & Record<'code', string>)['code']) {
		case 'ECONNRESET':
		case 'ECONNREFUSED': {
			break;
		}

		default: {
			Logger['logger'].error(error);

			break;
		}
	}

	return;
});

export function getKeys(pattern: string, keys: Set<string> = new Set<string>(), cursor: string = '0'): Promise<Set<string>> {
	return redis.scan(cursor, 'MATCH', pattern)
	.then(function (results: [string, string[]]): Promise<Set<string>> | Set<string> {
		for(let i: number = 0; i < results[1]['length']; i++) {
			keys.add(results[1][i]);
		}

		if(results[0] !== '0') {
			return getKeys(pattern, keys, results[0]);
		} else {
			return keys;
		}
	});
}