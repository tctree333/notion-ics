import { ICalEventBusyStatus } from 'ical-generator';
import type { QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints';

export default {
	filter: {
		and: [
			{ property: 'Status', select: { does_not_equal: 'Completed' } },
			{ property: 'Status', select: { does_not_equal: 'Nope' } }
		]
	},
	dateProperty: 'Scheduled',
	titleProperty: 'Name',
	timezone: 'America/Los_Angeles',
	busy: ICalEventBusyStatus.FREE
} as {
	filter: Readonly<QueryDatabaseParameters['filter']>;
	dateProperty: Readonly<string>;
	titleProperty: Readonly<string>;
	timezone: Readonly<string>;
	busy: Readonly<ICalEventBusyStatus>;
};
