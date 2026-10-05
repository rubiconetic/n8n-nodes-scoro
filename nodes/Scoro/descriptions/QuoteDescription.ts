import type { INodeProperties } from 'n8n-workflow';

import {
	customFieldsProperty,
	documentLinesProperty,
	listOptionsProperty,
	listProperties,
	locator,
	modifiedDateFilters,
} from './common';

export const quoteOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['quote'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new quote',
				action: 'Create a quote',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a quote',
				action: 'Delete a quote',
			},
			{
				name: 'Generate PDF',
				value: 'getPdf',
				description: 'Ask Scoro to generate the PDF of a quote',
				action: 'Generate a quote PDF',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a quote by ID',
				action: 'Get a quote',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many quotes',
				action: 'Get many quotes',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing quote',
				action: 'Update a quote',
			},
		],
		default: 'create',
	},
];

const quoteOptionalFields: INodeProperties[] = [
	locator('Contact Person', 'personId', 'searchContacts', 'Contact person for this quote'),
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'string',
		default: '',
		placeholder: 'e.g. EUR',
		description: 'Currency code (e.g. EUR, USD)',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		typeOptions: {
			rows: 3,
		},
		default: '',
		description: 'Description or notes for the quote header',
	},
	{
		displayName: 'Discount Percent',
		name: 'discount',
		type: 'number',
		default: 0,
		description: 'Discount percentage for the entire quote',
	},
	{
		displayName: 'Estimated Closing Date',
		name: 'estimatedClosingDate',
		type: 'dateTime',
		default: '',
		description: 'Estimated closing date for the quote',
	},
	{
		displayName: 'Is Sent',
		name: 'isSent',
		type: 'boolean',
		default: false,
		description: 'Whether the quote is marked as sent',
	},
	locator('Owner', 'ownerId', 'searchUsers', 'The owner of the quote'),
	locator('Project', 'projectId', 'searchProjects', 'The project this quote belongs to'),
	{
		displayName: 'Quote Date',
		name: 'date',
		type: 'dateTime',
		default: '',
		description: 'Date of the quote',
	},
	{
		displayName: 'Quote Name',
		name: 'quoteName',
		type: 'string',
		default: '',
		description: 'Title or name of the quote',
	},
	{
		displayName: 'Quote Number',
		name: 'no',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		options: [
			{
				name: 'Approved',
				value: 'approved',
			},
			{
				name: 'Completed',
				value: 'completed',
			},
			{
				name: 'Declined',
				value: 'declined',
			},
			{
				name: 'Incomplete',
				value: 'incomplete',
			},
			{
				name: 'Pending',
				value: 'pending',
			},
			{
				name: 'Ready',
				value: 'ready',
			},
		],
		default: 'pending',
		description: 'Status of the quote',
	},
	{
		displayName: 'Valid Until',
		name: 'deadline',
		type: 'dateTime',
		default: '',
		description: 'Quote validity expiration date',
	},
];

export const quoteFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                          quote:get / delete / update / getPdf              */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Quote ID',
		name: 'quoteId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['quote'],
				operation: ['get', 'delete', 'update', 'getPdf'],
			},
		},
		description: 'The unique ID of the quote',
	},
	{
		displayName: 'Template ID',
		name: 'templateId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['quote'],
				operation: ['getPdf'],
			},
		},
		description: 'The ID of the PDF template to use',
	},

	/* -------------------------------------------------------------------------- */
	/*                                 quote:create                               */
	/* -------------------------------------------------------------------------- */
	locator('Client', 'companyId', 'searchContacts', 'The client this quote is for', {
		required: true,
		displayOptions: {
			show: {
				resource: ['quote'],
				operation: ['create'],
			},
		},
	}),
	documentLinesProperty('quote'),
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['quote'],
				operation: ['create'],
			},
		},
		options: quoteOptionalFields,
	},

	/* -------------------------------------------------------------------------- */
	/*                                 quote:update                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['quote'],
				operation: ['update'],
			},
		},
		options: [
			locator('Client', 'companyId', 'searchContacts', 'The client this quote is for'),
			...quoteOptionalFields,
		],
	},
	customFieldsProperty('quote'),

	/* -------------------------------------------------------------------------- */
	/*                                 quote:getAll                               */
	/* -------------------------------------------------------------------------- */
	...listProperties('quote'),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['quote'],
				operation: ['getAll'],
			},
		},
		options: [
			locator('Client', 'companyId', 'searchContacts', 'Only return quotes for this client'),
			{
				displayName: 'Dated After',
				name: 'dateFrom',
				type: 'dateTime',
				default: '',
				description: 'Only return quotes dated on or after this date',
			},
			{
				displayName: 'Dated Before',
				name: 'dateTo',
				type: 'dateTime',
				default: '',
				description: 'Only return quotes dated on or before this date',
			},
			...modifiedDateFilters,
			locator('Project', 'projectId', 'searchProjects', 'Only return quotes for this project'),
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'Approved',
						value: 'approved',
					},
					{
						name: 'Completed',
						value: 'completed',
					},
					{
						name: 'Declined',
						value: 'declined',
					},
					{
						name: 'Incomplete',
						value: 'incomplete',
					},
					{
						name: 'Pending',
						value: 'pending',
					},
					{
						name: 'Ready',
						value: 'ready',
					},
				],
				default: 'pending',
				description: 'Filter quotes by status',
			},
		],
	},
	listOptionsProperty('quote'),
];
