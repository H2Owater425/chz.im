import { Channel } from '@library/type';
import { createHash, pbkdf2 } from 'crypto';
import { IncomingMessage } from 'http';
import { request } from 'https';

type PromiseArray<T> = {
	[K in keyof T]: Promise<T[K]>;
}

export function resolveInSequence<T extends unknown[]>(promises: PromiseArray<T>): Promise<T> {
	const results: T[number][] = [];

	return promises.reduce(function (previousPromise: Promise<T[number]>, currentPromise: Promise<T[number]>): Promise<T[number]> {
		return previousPromise
		.then(function (result: T[number]): Promise<T[number]> {
			results.push(result);

			return currentPromise;
		});
	})
	.then(function (result: T[number]): T {
		return results.concat(result) as T;
	});
}

export function getChannel(id: string): Promise<Channel | undefined> {
	return new Promise<Channel | undefined>(function (resolve: ResolveFunction<Channel | undefined>, reject: RejectFunction): void {
		request('https://api.chzzk.naver.com/service/v1/channels/' + id, function (response: IncomingMessage): void {
			if(response['statusCode'] === 200) {
				const chunks: Buffer[] = [];
				let totalLength: number = 0;

				response.on('data', function (chunk: Buffer): void {
					chunks.push(chunk);
					totalLength += chunk['byteLength'];

					return;
				})
				.once('error', reject)
				.once('end', function (): void {
					const channel: Channel = JSON.parse(String(Buffer.concat(chunks, totalLength)))['content'];

					resolve(channel['channelId'] !== null ? channel : undefined);

					return;
				});
			} else {
				reject(new Error('Request rejected'));
			}

			return;
		})
		.once('error', reject)
		.end();

		return;
	});
}

export function getEncryptedPassword(password: string, salt: string): Promise<string> {
	return new Promise<string>(function (resolve: ResolveFunction<string>, reject: RejectFunction): void {
		pbkdf2(password, createHash('sha256').update(salt).digest(), Number(process['env']['PBKDF2_ITERATION']), 64, 'sha512', function (error: Error | null, encryptedPassword: Buffer) {
			if(error === null) {
				resolve(encryptedPassword.toString('hex'));
			} else {
				reject(error);
			}
		});

		return;
	});
}