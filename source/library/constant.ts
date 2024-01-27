import { readFileSync } from 'fs';
import { join } from 'path';

export const ENVIRONMENT_VARIABLE_NAMES = ['DATABASE_URL', 'CACHE_DATABASE_URL', 'PBKDF2_ITERATION', 'PORT', 'RATE_LIMIT'] as const;

export const HTTP_ERROR_CODES = {
	400: 'BadRequest',
	401: 'Unauthorized',
	//402: 'PaymentRequired',
	//403: 'Forbidden',
	404: 'NotFound',
	405: 'MethodNotAllowed',
	//406: 'NotAcceptable',
	//407: 'ProxyAuthenticationRequired',
	//408: 'RequestTimeout',
	409: 'Conflict',
	//410: 'Gone',
	//411: 'LengthRequired',
	//412: 'PreconditionFailed',
	//413: 'PayloadTooLarge',
	//414: 'URITooLong',
	415: 'UnsupportedMediaType',
	//416: 'RangeNotSatisfiable',
	//417: 'ExpectationFailed',
	418: 'ImATeapot',
	//421: 'MisdirectedRequest',
	//422: 'UnprocessableEntity',
	//423: 'Locked',
	//424: 'FailedDependency',
	//425: 'UnorderedCollection',
	//426: 'UpgradeRequired',
	//428: 'PreconditionRequired',
	429: 'TooManyRequests',
	//431: 'RequestHeaderFieldsTooLarge',
	//451: 'UnavailableForLegalReasons',
	500: 'InternalServerError',
	//501: 'NotImplemented',
	//502: 'BadGateway',
	//503: 'ServiceUnavailable',
	//504: 'GatewayTimeout',
	//505: 'HTTPVersionNotSupported',
	//506: 'VariantAlsoNegotiates',
	//507: 'InsufficientStorage',
	//508: 'LoopDetected',
	//509: 'BandwidthLimitExceeded',
	//510: 'NotExtend',
	//511: 'NetworkAuthenticationRequire',
} as const;

export const enum SCHEMA_TYPE {
	NUMBER,
	STRING,
	BOOLEAN,
	NULL,
	OBJECT,
	ARRAY,
	AND,
	OR,
	NOT
}

export const CHZZK_BASE_URL = 'https://chzzk.naver.com/' as const;

export const INDEX_HTML: string = readFileSync(join(__dirname, 'index.html')).toString();

export const HANDLE_HTML: string = readFileSync(join(__dirname, 'handle.html')).toString();

export const FAVICON: Buffer = readFileSync(join(__dirname, 'favicon.ico'));