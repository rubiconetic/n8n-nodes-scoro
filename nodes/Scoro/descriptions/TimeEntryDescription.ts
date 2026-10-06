import type { INodeProperties } from 'n8n-workflow';

import {
	customJsonFilterOption,
	listOptionsProperty,
	listProperties,
	locator,
	modifiedDateFilters,
} from './common';

export const timeEntryOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['timeEntry'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new time entry',
				action: 'Create a time entry',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a time entry',
				action: 'Delete a time entry',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a time entry by ID',
				action: 'Get a time entry',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many time entries',
				action: 'Get many time entries',
			},
			{
				name: 'Set Done',
				value: 'setDone',
				description: 'Mark a time entry as done',
				action: 'Mark a time entry as done',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing time entry',
				action: 'Update a time entry',
			},
		],
		default: 'create',
	},
];

const timeEntryOptionalFields: INodeProperties[] = [
	{
		displayName: 'Activity ID',
		name: 'activityId',
		type: 'string',
		default: '',
		description: 'The ID of the activity type',
	},
	{
		displayName: 'Billable Duration',
		name: 'billableDuration',
		type: 'string',
		default: '',
		placeholder: 'e.g. 01:30:00',
		description: 'Billable duration as HH:MM:SS',
	},
	{
		displayName: 'Billable Time Type',
		name: 'billableTimeType',
		type: 'options',
		options: [
			{
				name: 'Billable',
				value: 'billable',
			},
			{
				name: 'Custom',
				value: 'custom',
			},
			{
				name: 'Non-Billable',
				value: 'non_billable',
			},
		],
		default: 'billable',
		description: 'Whether the time entry is billable',
	},
	{
		displayName: 'Date',
		name: 'date',
		type: 'dateTime',
		default: '',
		description: 'Date the work occurred',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		typeOptions: {
			rows: 3,
		},
		default: '',
		description: 'Description of the work performed',
	},
	{
		displayName: 'Is Completed',
		name: 'isCompleted',
		type: 'boolean',
		default: false,
		description: 'Whether the time entry is completed',
	},
	{
		displayName: 'Start Time',
		name: 'startDatetime',
		type: 'dateTime',
		default: '',
		description: 'Start date and time of the time entry',
	},
];

export const timeEntryFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                   timeEntry:get / delete / setDone / update                */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Time Entry ID',
		name: 'timeEntryId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['timeEntry'],
				operation: ['get', 'delete', 'setDone', 'update'],
			},
		},
		description: 'The unique ID of the time entry',
	},

	/* -------------------------------------------------------------------------- */
	/*                              timeEntry:create                              */
	/* -------------------------------------------------------------------------- */
	locator('Task', 'eventId', 'searchTasks', 'The task to log time against', {
		required: true,
		displayOptions: {
			show: {
				resource: ['timeEntry'],
				operation: ['create'],
			},
		},
	}),
	locator('User', 'userId', 'searchUsers', 'The user who performed the work', {
		required: true,
		displayOptions: {
			show: {
				resource: ['timeEntry'],
				operation: ['create'],
			},
		},
	}),
	{
		displayName: 'Duration',
		name: 'duration',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. 01:30:00',
		displayOptions: {
			show: {
				resource: ['timeEntry'],
				operation: ['create'],
			},
		},
		description: 'Time worked as HH:MM:SS. A plain number is read as minutes.',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['timeEntry'],
				operation: ['create'],
			},
		},
		options: timeEntryOptionalFields,
	},

	/* -------------------------------------------------------------------------- */
	/*                              timeEntry:update                              */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['timeEntry'],
				operation: ['update'],
			},
		},
		options: [
			...timeEntryOptionalFields.slice(0, 5),
			{
				displayName: 'Duration',
				name: 'duration',
				type: 'string',
				default: '',
				placeholder: 'e.g. 01:30:00',
				description: 'Time worked as HH:MM:SS. A plain number is read as minutes.',
			},
			...timeEntryOptionalFields.slice(5),
			locator('Task', 'eventId', 'searchTasks', 'The task to log time against'),
			locator('User', 'userId', 'searchUsers', 'The user who performed the work'),
		],
	},

	/* -------------------------------------------------------------------------- */
	/*                              timeEntry:getAll                              */
	/* -------------------------------------------------------------------------- */
	...listProperties('timeEntry'),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['timeEntry'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Date After',
				name: 'dateFrom',
				type: 'dateTime',
				default: '',
				description: 'Only return time entries on or after this date',
			},
			{
				displayName: 'Date Before',
				name: 'dateTo',
				type: 'dateTime',
				default: '',
				description: 'Only return time entries on or before this date',
			},
			{
				displayName: 'Is Completed',
				name: 'isCompleted',
				type: 'boolean',
				default: false,
				description: 'Whether to filter by completed status',
			},
			...modifiedDateFilters,
			locator('Task', 'eventId', 'searchTasks', 'Only return time entries for this task'),
			locator('User', 'userId', 'searchUsers', 'Only return time entries for this user'),
			customJsonFilterOption,
		],
	},
	listOptionsProperty('timeEntry'),
];
