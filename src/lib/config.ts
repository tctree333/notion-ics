import { ICalEventBusyStatus } from 'ical-generator';
import type { QueryDataSourceParameters } from '@notionhq/client/build/src/api-endpoints';

export default {
	filter: {
		and: [
			{ property: 'Status', status: { does_not_equal: 'Completed' } },
			{ property: 'Status', status: { does_not_equal: 'Nope' } },
			{ property: 'Type', select: { equals: 'Task' } }
		]
	},
	dateProperty: 'Scheduled',
	titleProperty: 'Name',
	busy: ICalEventBusyStatus.FREE
} as {
	filter: Readonly<QueryDataSourceParameters['filter']>;
	dateProperty: Readonly<string>;
	titleProperty: Readonly<string>;
	busy: Readonly<ICalEventBusyStatus>;
};
