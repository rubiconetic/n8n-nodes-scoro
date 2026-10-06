import type { INodeProperties } from 'n8n-workflow';

import {
	customFieldsProperty,
	documentLinesProperty,
	listOptionsProperty,
	listProperties,
	locator,
	modifiedDateFilters,
} from './common';

export const purchaseOrderOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['purchaseOrder'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new purchase order',
				action: 'Create a purchase order',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a purchase order',
				action: 'Delete a purchase order',
			},
			{
				name: 'Generate PDF',
				value: 'getPdf',
				description: 'Ask Scoro to generate the PDF of a purchase order',
				action: 'Generate a purchase order PDF',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a purchase order by ID',
				action: 'Get a purchase order',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many purchase orders',
				action: 'Get many purchase orders',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing purchase order',
				action: 'Update a purchase order',
			},
		],
		default: 'create',
	},
];

const purchaseOrderOptionalFields: INodeProperties[] = [
	locator('Contact Person', 'personId', 'searchContacts', 'Contact person at the supplier'),
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
		description: 'Expected delivery date',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		typeOptions: {
			rows: 3,
		},
		default: '',
		description: 'Description or notes for the purchase order header',
	},
	{
		displayName: 'Discount Percent',
		name: 'discount',
		type: 'number',
		default: 0,
		description: 'Discount percentage for the entire purchase order',
	},
	{
		displayName: 'Is Sent',
		name: 'isSent',
		type: 'boolean',
		default: false,
		description: 'Whether the purchase order is marked as sent',
	},
	locator('Owner', 'ownerId', 'searchUsers', 'The owner of the purchase order'),
	locator('Project', 'projectId', 'searchProjects', 'The project this purchase order belongs to'),
	{
		displayName: 'Purchase Order Date',
		name: 'date',
		type: 'dateTime',
		default: '',
		description: 'Date of the purchase order',
	},
	{
		displayName: 'Purchase Order Number',
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
		description: 'Status of the purchase order',
	},
];

export const purchaseOrderFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                     purchaseOrder:get / delete / update / getPdf           */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Purchase Order ID',
		name: 'purchaseOrderId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['purchaseOrder'],
				operation: ['get', 'delete', 'update', 'getPdf'],
			},
		},
		description: 'The unique ID of the purchase order',
	},
	{
		displayName: 'Template ID',
		name: 'templateId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['purchaseOrder'],
				operation: ['getPdf'],
			},
		},
		description: 'The ID of the PDF template to use',
	},

	/* -------------------------------------------------------------------------- */
	/*                            purchaseOrder:create                            */
	/* -------------------------------------------------------------------------- */
	locator(
		'Supplier',
		'companyId',
		'searchContacts',
		'The supplier or vendor for this purchase order',
		{
			required: true,
			displayOptions: {
				show: {
					resource: ['purchaseOrder'],
					operation: ['create'],
				},
			},
		},
	),
	documentLinesProperty('purchaseOrder'),
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['purchaseOrder'],
				operation: ['create'],
			},
		},
		options: purchaseOrderOptionalFields,
	},

	/* -------------------------------------------------------------------------- */
	/*                            purchaseOrder:update                            */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['purchaseOrder'],
				operation: ['update'],
			},
		},
		options: [
			...purchaseOrderOptionalFields,
			locator(
				'Supplier',
				'companyId',
				'searchContacts',
				'The supplier or vendor for this purchase order',
			),
		],
	},
	customFieldsProperty('purchaseOrder'),

	/* -------------------------------------------------------------------------- */
	/*                            purchaseOrder:getAll                            */
	/* -------------------------------------------------------------------------- */
	...listProperties('purchaseOrder'),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['purchaseOrder'],
				operation: ['getAll'],
			},
		},
		options: [
			locator(
				'Supplier',
				'companyId',
				'searchContacts',
				'Only return purchase orders for this supplier',
			),
			{
				displayName: 'Created After',
				name: 'dateFrom',
				type: 'dateTime',
				default: '',
				description: 'Only return purchase orders dated on or after this date',
			},
			{
				displayName: 'Created Before',
				name: 'dateTo',
				type: 'dateTime',
				default: '',
				description: 'Only return purchase orders dated on or before this date',
			},
			...modifiedDateFilters,
			locator(
				'Project',
				'projectId',
				'searchProjects',
				'Only return purchase orders for this project',
			),
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
				description: 'Filter purchase orders by status',
			},
		],
	},
	listOptionsProperty('purchaseOrder'),
];
