import { IncomingMessage, ServerResponse } from 'http';
import Server from '@library/server';
import { SCHEMA_TYPE } from '@library/constant';
import { ColumnType } from 'kysely';

type Generated<T> = T extends ColumnType<infer S, infer I, infer U> ? ColumnType<S, I | undefined, U> : ColumnType<T, T | undefined, T>;

export type NumberSchema = {
	type: SCHEMA_TYPE.NUMBER;
	enum?: undefined;
	minimum?: number;
	maximum?: number;
	isInteger?: true;
	isOptional?: undefined;
} | {
	type: SCHEMA_TYPE.NUMBER;
	enum?: undefined;
	minimum?: number;
	maximum?: number;
	isInteger?: true;
	default?: number;
	isOptional: true;
} | {
	type: SCHEMA_TYPE.NUMBER;
	minimum?: undefined;
	maximum?: undefined;
	isInteger?: undefined;
	enum: number[];
	isOptional?: undefined;
} | {
	type: SCHEMA_TYPE.NUMBER;
	minimum?: undefined;
	maximum?: undefined;
	isInteger?: undefined;
	enum: number[];
	default?: number;
	isOptional: true;
};

export type StringSchema = {
	type: SCHEMA_TYPE.STRING;
	pattern?: undefined;
	enum?: undefined;
	minimum?: number;
	maximum?: number;
	isOptional?: undefined;
} | {
	type: SCHEMA_TYPE.STRING;
	pattern?: undefined;
	enum?: undefined;
	minimum?: number;
	maximum?: number;
	default?: string;
	isOptional: true;
} | {
	type: SCHEMA_TYPE.STRING;
	pattern: RegExp;
	enum?: undefined;
	minimum?: undefined;
	maximum?: undefined;
	isOptional?: undefined;
} | {
	type: SCHEMA_TYPE.STRING;
	pattern: RegExp;
	enum?: undefined;
	minimum?: undefined;
	maximum?: undefined;
	default?: string;
	isOptional: true;
} | {
	type: SCHEMA_TYPE.STRING,
	enum: string[];
	pattern?: undefined;
	minimum?: undefined;
	maximum?: undefined;
	isOptional?: undefined;
} | {
	type: SCHEMA_TYPE.STRING,
	enum: string[];
	pattern?: undefined;
	minimum?: undefined;
	maximum?: undefined;
	default?: string;
	isOptional: true;
}

export type BooleanSchema = {
	type: SCHEMA_TYPE.BOOLEAN;
	isOptional?: undefined;
} | {
	type: SCHEMA_TYPE.BOOLEAN;
	default?: boolean;
	isOptional: true;
};

export type NullSchema = {
	type: SCHEMA_TYPE.NULL;
	isOptional?: undefined;
} | {
	type: SCHEMA_TYPE.NULL;
	default?: null;
	isOptional: true;
};

export type ObjectSchema = {
	type: SCHEMA_TYPE.OBJECT;
	properties: Record<string, Schema>;
	allowAdditionalProperties?: true;
	isOptional?: undefined;
} | {
	type: SCHEMA_TYPE.OBJECT;
	properties: Record<string, Schema>;
	isOptional: true;
	default?: {};
	allowAdditionalProperties?: true;
};

export type ArraySchema = {
	type: SCHEMA_TYPE.ARRAY;
	items: Schema | Schema[];
	minimum?: number;
	maximum?: number;
	isOptional?: undefined;
} | {
	type: SCHEMA_TYPE.ARRAY;
	items: Schema | Schema[];
	minimum?: number;
	maximum?: number;
	isOptional: true;
	default?: {}[];
};

export type NotSchema = {
	type: SCHEMA_TYPE.NOT;
	isOptional?: true;
	schema: Schema;
};

export type AndSchema = {
	type: SCHEMA_TYPE.AND;
	isOptional?: true;
	schemas: Schema[];
};

export type OrSchema = {
	type: SCHEMA_TYPE.OR;
	isOptional?: true;
	schemas: Schema[];
};

export type Schema = NumberSchema | StringSchema | BooleanSchema | NullSchema | ObjectSchema | ArraySchema | AndSchema | OrSchema | NotSchema;

export type GenericKey = 'parameter' | 'query' | 'header' | 'body';

export type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'OPTIONS';

export type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

export type Handler = (request: Request<any>, response: Response) => Promise<unknown> | unknown;

export interface Request<Generic extends Partial<Record<GenericKey, unknown>> = Partial<Record<GenericKey, unknown>>> extends Required<Omit<IncomingMessage, 'statusCode' | 'statusMessage'>> {
	startTime: number;
	ip: string;
	server: Server;
	parameter: Generic['parameter'];
	query: Generic['query'];
	header: Generic['header'];
	body: Generic['body'];
}

export interface Response extends ServerResponse {
	request: Request;
	server: Server;
	setStatus(code: number): void;
	send(data?: unknown): void;
	redirect(url: string, code?: number): void;
}

export interface Route {
	handlers: Handler[];
	schema?: Partial<Record<GenericKey, Schema>>;
}

export interface Database {
	link: {
		id: Generated<number>;
		handle: string;
		target: string;
		visited_count: Generated<number>;
		password: string;
		created_at: Generated<Date>;
	}
}

export interface Link {
	id: number;
	handle: string;
	target: string;
	visitedCount: number;
	password: string;
	createdAt: Date;
}

export interface Channel {
	channelId: string;
	channelName: string;
	channelImageUrl: string | null;
	verifiedMark: boolean;
	channelType: 'STREAMING' | 'NORMAL';
	channelDescription: string;
	followerCount: number;
	openLive: boolean;
}