import Module from '@library/module';
import postLinksController from './postLinks.controller';
import { SCHEMA_TYPE } from '@library/constant';
import linkSchema from '@schemas/link';
import deleteLinkController from './deleteLink.controller';

export default new Module([{
	method: 'POST',
	path: '',
	handlers: [postLinksController],
	schema: {
		body: {
			type: SCHEMA_TYPE['OBJECT'],
			properties: {
				handle: linkSchema['handle'],
				target: linkSchema['target'],
				password: linkSchema['password']
			}
		}
	}
}, {
	method: 'DELETE',
	path: ':handle',
	handlers: [deleteLinkController],
	schema: {
		parameter: {
			type: SCHEMA_TYPE['OBJECT'],
			properties: {
				handle: linkSchema['handle']
			}
		},
		body: {
			type: SCHEMA_TYPE['OBJECT'],
			properties: {
				password: linkSchema['password']
			}
		}
	}
}], 'links');