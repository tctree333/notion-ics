import config from '$lib/config';
import { Client } from '@notionhq/client';
import ical from 'ical-generator';
import { getVtimezoneComponent } from '@touch4it/ical-timezones';
import type { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import type { RequestHandler } from '@sveltejs/kit';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export const get: RequestHandler = async ({ params, url }) => {
	const secret = url.searchParams.get('secret');
	if (secret !== process.env.ACCESS_KEY) {
		return { status: 403, body: 'Forbidden' };
	}

	const { id } = params;

	const databaseMetadata = await notion.databases.retrieve({ database_id: id });

	const databaseEntries = [];
	let query: QueryDatabaseResponse | { has_more: true; next_cursor: undefined } = {
		has_more: true,
		next_cursor: undefined
	};
	while (query.has_more) {
		query = await notion.databases.query({
			database_id: id,
			page_size: 100,
			start_cursor: query.next_cursor,
			filter: config.filter
		});
		databaseEntries.push(...query.results);
	}

	const filtered: {
		title: string;
		date: { start: string; end: string | null; time_zone: string | null };
	}[] = databaseEntries.flatMap((object) => {
		if (object.properties[config.dateProperty].date === null) {
			return [];
		}
		return [
			{
				title: object.properties[config.titleProperty].title[0].text.content,
				date: object.properties[config.dateProperty].date
			}
		];
	});

	const calendar = ical({
		name: databaseMetadata.title[0].text.content,
		prodId: { company: 'Tomi Chen', language: 'EN', product: 'notion-ics' },
		timezone: {
			name: 'TZGEN',
			generator: getVtimezoneComponent
		}
	});
	filtered.forEach((event) => {
		calendar.createEvent({
			start: event.date.start,
			end: event.date.end,
			timezone: 'UTC',
			allDay: true,
			summary: event.title,
			busystatus: config.busy
		});
	});

	return {
		status: 200,
		body: calendar.toString(),
		headers: {
			'content-type': 'text/calendar'
		}
	};
};
