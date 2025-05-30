import Module from '@library/module';
import getRootController from './getRoot.controller';
import getFaviconIcoController from './getFaviconIco.controller';
import getRobotsTxtController from './getRobotsTxt.controller';
import postAndGetCoffeeController from './postAndGetCoffee.controller';
import wellKnownModule from './.well-known/wellKnown.module';
import getHandleController from './getHandle.controller';
import { SCHEMA_TYPE } from '@library/constant';
import linksModule from './links/links.module';
import getSitemapXmlController from './getSitemapXml.controller';
import getOgImagePngController from './getOgImagePng.controller';

export default new Module([{
	method: 'GET',
	path: '',
	handlers: [getRootController]
}, {
	method: 'GET',
	path: 'favicon.ico',
	handlers: [getFaviconIcoController]
}, {
	method: 'GET',
	path: 'ogImage.png',
	handlers: [getOgImagePngController]
}, {
	method: 'GET',
	path: 'robots.txt',
	handlers: [getRobotsTxtController]
}, {
	method: 'GET',
	path: 'sitemap.xml',
	handlers: [getSitemapXmlController]
}, {
	method: 'POST',
	path: 'coffee',
	handlers: [postAndGetCoffeeController]
}, {
	method: 'GET',
	path: 'coffee',
	handlers: [postAndGetCoffeeController]
}, {
	method: 'GET',
	path: ':handle',
	handlers: [getHandleController],
	schema: {
		parameter: {
			type: SCHEMA_TYPE['OBJECT'],
			properties: {
				handle: {
					type: SCHEMA_TYPE['STRING'],
					pattern: /^[^+\/]{1,32}\+?$/
				}
			}
		}
	}
}], '/', [wellKnownModule, linksModule]);