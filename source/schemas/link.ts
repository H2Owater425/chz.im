import { Link, Schema } from '@library/type';
import { SCHEMA_TYPE } from '@library/constant';

export default {
	id: {
		type: SCHEMA_TYPE['NUMBER'],
		isInteger: true,
		minimum: 1,
		maximum: Number['MAX_VALUE']
	},
	handle: {
		type: SCHEMA_TYPE['STRING'],
		pattern: /^[^+\/]{1,32}$/
	},
	target: {
		type: SCHEMA_TYPE['STRING'],
		pattern: /^.{1,32}$/
	},
	visitedCount: {
		type: SCHEMA_TYPE['NUMBER'],
		isInteger: true,
		minimum: 0,
		maximum: Number['MAX_VALUE']
	},
	password: {
		type: SCHEMA_TYPE['STRING'],
		minimum: 1
	},
	createdAt: {
		type: SCHEMA_TYPE['STRING'],
		pattern: /^\d+-(0[1-9]|1[012])-(0[1-9]|[12]\d|3[01])[Tt]([01]\d|2[0-3]):[0-5]\d:([0-5]\d|60)(\.\d+)?([Zz]|[\|-]([01]\d|2[0-3]):[0-5]\d)$/
	}
} satisfies Record<keyof Link, Schema>;