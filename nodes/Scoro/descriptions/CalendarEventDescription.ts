import type { INodeProperties } from 'n8n-workflow';

import {
	customFieldsProperty,
	listOptionsProperty,
	listProperties,
	locator,
	modifiedDateFilters,
} from './common';

export const calendarEventOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['calendarEvent'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new calendar event',
				action: 'Create a calendar event',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a calendar event',
				action: 'Delete a calendar event',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a calendar event by ID',
				action: 'Get a calendar event',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many calendar events',
				action: 'Get many calendar events',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing calendar event',
				action: 'Update a calendar event',
			},
		],
		default: 'create',
	},
];

const calendarEventOptionalFields: INodeProperties[] = [
	{
		displayName: 'Address',
		name: 'address',
		type: 'string',
		default: '',
		description: 'Location or address of the event',
	},
	{
		displayName: 'Call Link',
		name: 'callLink',
		type: 'string',
		default: '',
		placeholder: 'e.g. https://meet.google.com/...',
		description: 'Video conference or meeting link',
	},
	locator('Client', 'companyId', 'searchContacts', 'The company or client this event relates to'),
	locator('Contact Person', 'personId', 'searchContacts', 'Contact person for this event'),
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		typeOptions: {
			rows: 3,
		},
		default: '',
		description: 'Description or notes for the calendar event',
	},
	{
		displayName: 'End Date & Time',
		name: 'endDatetime',
		type: 'dateTime',
		default: '',
		description: 'Event end timestamp',
	},
	{
		displayName: 'Full Day Event',
		name: 'fullDayEvent',
		type: 'boolean',
		default: false,
		description: 'Whether this is an all-day event',
	},
	{
		displayName: 'Is Personal',
		name: 'isPersonal',
		type: 'boolean',
		default: false,
		description: 'Whether the event is personal or work-related',
	},
	locator('Owner', 'ownerId', 'searchUsers', 'The owner / organizer of the event'),
	locator('Project', 'projectId', 'searchProjects', 'The project this event belongs to'),
	locator('Related Task', 'relatedTaskId', 'searchTasks', 'Related task for this event'),
	{
		displayName: 'Start Date & Time',
		name: 'startDatetime',
		type: 'dateTime',
		default: '',
		description: 'Event start timestamp',
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		options: [
			{
				name: 'Busy',
				value: 'busy',
			},
			{
				name: 'Free',
				value: 'free',
			},
			{
				name: 'Out of Office',
				value: 'outofoffice',
			},
			{
				name: 'Tentative',
				value: 'tentative',
			},
		],
		default: 'busy',
		description: 'Status or availability of the event',
	},
];

export const calendarEventFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                        calendarEvent:get / delete / update                 */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Event ID',
		name: 'eventId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['calendarEvent'],
				operation: ['get', 'delete', 'update'],
			},
		},
		description: 'The unique ID of the calendar event',
	},

	/* -------------------------------------------------------------------------- */
	/*                            calendarEvent:create                            */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Event Name',
		name: 'eventName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['calendarEvent'],
				operation: ['create'],
			},
		},
		description: 'Title or name of the calendar event',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['calendarEvent'],
				operation: ['create'],
			},
		},
		options: calendarEventOptionalFields,
	},

	/* -------------------------------------------------------------------------- */
	/*                            calendarEvent:update                            */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['calendarEvent'],
				operation: ['update'],
			},
		},
		options: [
			...calendarEventOptionalFields,
			{
				displayName: 'Event Name',
				name: 'eventName',
				type: 'string',
				default: '',
				description: 'Title or name of the calendar event',
			},
		],
	},
	customFieldsProperty('calendarEvent'),

	/* -------------------------------------------------------------------------- */
	/*                            calendarEvent:getAll                            */
	/* -------------------------------------------------------------------------- */
	...listProperties('calendarEvent'),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['calendarEvent'],
				operation: ['getAll'],
			},
		},
		options: [
			locator('Client', 'companyId', 'searchContacts', 'Only return events for this client'),
			...modifiedDateFilters,
			locator('Owner', 'ownerId', 'searchUsers', 'Only return events owned by this user'),
			locator('Project', 'projectId', 'searchProjects', 'Only return events for this project'),
			{
				displayName: 'Start After',
				name: 'startFrom',
				type: 'dateTime',
				default: '',
				description: 'Only return events starting on or after this date',
			},
			{
				displayName: 'Start Before',
				name: 'startTo',
				type: 'dateTime',
				default: '',
				description: 'Only return events starting on or before this date',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'Busy',
						value: 'busy',
					},
					{
						name: 'Free',
						value: 'free',
					},
					{
						name: 'Out of Office',
						value: 'outofoffice',
					},
					{
						name: 'Tentative',
						value: 'tentative',
					},
				],
				default: 'busy',
				description: 'Filter events by status',
			},
		],
	},
	listOptionsProperty('calendarEvent'),
];
