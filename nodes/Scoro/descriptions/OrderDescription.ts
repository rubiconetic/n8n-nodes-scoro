import type { INodeProperties } from 'n8n-workflow';

import {
	customFieldsProperty,
	documentLinesProperty,
	listOptionsProperty,
	listProperties,
	locator,
	modifiedDateFilters,
} from './common';

export const orderOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['order'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new order',
				action: 'Create an order',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an order',
				action: 'Delete an order',
			},
			{
				name: 'Generate PDF',
				value: 'getPdf',
				description: 'Ask Scoro to generate the PDF of an order',
				action: 'Generate an order PDF',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an order by ID',
				action: 'Get an order',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many orders',
				action: 'Get many orders',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing order',
				action: 'Update an order',
			},
		],
		default: 'create',
	},
];

const orderOptionalFields: INodeProperties[] = [
	locator('Contact Person', 'personId', 'searchContacts', 'Contact person for this order'),
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'string',
		default: '',
		placeholder: 'e.g. EUR',
		description: 'Currency code (e.g. EUR, USD)',
	},
	{
		displayName: 'Delivery Date',
		name: 'deadline',
		type: 'dateTime',
		default: '',
		description: 'Delivery or fulfillment deadline',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		typeOptions: {
			rows: 3,
		},
		default: '',
		description: 'Description or notes for the order header',
	},
	{
		displayName: 'Discount Percent',
		name: 'discount',
		type: 'number',
		default: 0,
		description: 'Discount percentage for the entire order',
	},
	{
		displayName: 'Is Sent',
		name: 'isSent',
		type: 'boolean',
		default: false,
		description: 'Whether the order is marked as sent',
	},
	{
		displayName: 'Order Date',
		name: 'date',
		type: 'dateTime',
		default: '',
		description: 'Date of the order',
	},
	{
		displayName: 'Order Number',
		name: 'no',
		type: 'string',
		default: '',
	},
	locator('Owner', 'ownerId', 'searchUsers', 'The owner of the order'),
	locator('Project', 'projectId', 'searchProjects', 'The project this order belongs to'),
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		options: [
			{
				name: 'Completed',
				value: 'completed',
			},
			{
				name: 'Confirmed',
				value: 'confirmed',
			},
			{
				name: 'In Progress',
				value: 'in_progress',
			},
			{
				name: 'Incomplete',
				value: 'incomplete',
			},
			{
				name: 'Pending',
				value: 'pending',
			},
		],
		default: 'pending',
		description: 'Status of the order',
	},
];

export const orderFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                          order:get / delete / update / getPdf              */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['get', 'delete', 'update', 'getPdf'],
			},
		},
		description: 'The unique ID of the order',
	},
	{
		displayName: 'Template ID',
		name: 'templateId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['getPdf'],
			},
		},
		description: 'The ID of the PDF template to use',
	},

	/* -------------------------------------------------------------------------- */
	/*                                order:create                                */
	/* -------------------------------------------------------------------------- */
	locator('Client', 'companyId', 'searchContacts', 'The client this order is for', {
		required: true,
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['create'],
			},
		},
	}),
	documentLinesProperty('order'),
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['create'],
			},
		},
		options: orderOptionalFields,
	},

	/* -------------------------------------------------------------------------- */
	/*                                order:update                                */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['update'],
			},
		},
		options: [
			...orderOptionalFields,
			locator('Client', 'companyId', 'searchContacts', 'The client this order is for'),
		],
	},
	customFieldsProperty('order'),

	/* -------------------------------------------------------------------------- */
	/*                                order:getAll                                */
	/* -------------------------------------------------------------------------- */
	...listProperties('order'),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['getAll'],
			},
		},
		options: [
			locator('Client', 'companyId', 'searchContacts', 'Only return orders for this client'),
			{
				displayName: 'Created After',
				name: 'dateFrom',
				type: 'dateTime',
				default: '',
				description: 'Only return orders dated on or after this date',
			},
			{
				displayName: 'Created Before',
				name: 'dateTo',
				type: 'dateTime',
				default: '',
				description: 'Only return orders dated on or before this date',
			},
			...modifiedDateFilters,
			locator('Project', 'projectId', 'searchProjects', 'Only return orders for this project'),
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'Completed',
						value: 'completed',
					},
					{
						name: 'Confirmed',
						value: 'confirmed',
					},
					{
						name: 'In Progress',
						value: 'in_progress',
					},
					{
						name: 'Incomplete',
						value: 'incomplete',
					},
					{
						name: 'Pending',
						value: 'pending',
					},
				],
				default: 'pending',
				description: 'Filter orders by status',
			},
		],
	},
	listOptionsProperty('order'),
];
