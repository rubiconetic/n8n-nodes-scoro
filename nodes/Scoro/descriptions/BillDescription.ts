import type { INodeProperties } from 'n8n-workflow';

import {
	customFieldsFilterOption,
	customFieldsProperty,
	customJsonFilterOption,
	documentLinesProperty,
	listOptionsProperty,
	listProperties,
	locator,
	modifiedDateFilters,
} from './common';

export const billOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['bill'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new bill',
				action: 'Create a bill',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a bill',
				action: 'Delete a bill',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a bill by ID',
				action: 'Get a bill',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many bills',
				action: 'Get many bills',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing bill',
				action: 'Update a bill',
			},
		],
		default: 'create',
	},
];

const billOptionalFields: INodeProperties[] = [
	{
		displayName: 'Bill Date',
		name: 'date',
		type: 'dateTime',
		default: '',
		description: 'Date of the bill',
	},
	{
		displayName: 'Bill Number',
		name: 'no',
		type: 'string',
		default: '',
	},
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
		displayName: 'Description',
		name: 'description',
		type: 'string',
		typeOptions: {
			rows: 3,
		},
		default: '',
		description: 'Description or notes for the bill header',
	},
	{
		displayName: 'Discount Percent',
		name: 'discount',
		type: 'number',
		default: 0,
		description: 'Discount percentage for the entire bill',
	},
	{
		displayName: 'Due Date',
		name: 'deadline',
		type: 'dateTime',
		default: '',
		description: 'Payment deadline / due date',
	},
	{
		displayName: 'Is Chargeable',
		name: 'isChargeable',
		type: 'boolean',
		default: false,
		description: 'Whether the bill is chargeable to a client',
	},
	locator('Owner', 'ownerId', 'searchUsers', 'The owner of the bill'),
	{
		displayName: 'Payment Date',
		name: 'dateofpayment',
		type: 'dateTime',
		default: '',
		description: 'Date when the bill was paid',
	},
	{
		displayName: 'Payment Type',
		name: 'paymentType',
		type: 'options',
		options: [
			{
				name: 'Bank Transfer',
				value: 'banktransfer',
			},
			{
				name: 'Barter',
				value: 'barter',
			},
			{
				name: 'Card Payment',
				value: 'cardpayment',
			},
			{
				name: 'Cash',
				value: 'cash',
			},
			{
				name: 'Credit',
				value: 'credit',
			},
		],
		default: 'banktransfer',
		description: 'Payment method',
	},
	locator('Project', 'projectId', 'searchProjects', 'The project this bill belongs to'),
	{
		displayName: 'Purchase Order ID',
		name: 'purchaseOrderId',
		type: 'string',
		default: '',
		description: 'Related purchase order ID',
	},
	{
		displayName: 'Reference Number',
		name: 'referenceNo',
		type: 'string',
		default: '',
		description: 'Reference number for payment',
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		options: [
			{
				name: 'Paid',
				value: 'paid',
			},
			{
				name: 'Unpaid',
				value: 'unpaid',
			},
		],
		default: 'unpaid',
		description: 'Status of the bill',
	},
];

export const billFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                            bill:get / delete / update                      */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Bill ID',
		name: 'billId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['bill'],
				operation: ['get', 'delete', 'update'],
			},
		},
		description: 'The unique ID of the bill',
	},

	/* -------------------------------------------------------------------------- */
	/*                                 bill:create                                */
	/* -------------------------------------------------------------------------- */
	locator('Supplier', 'companyId', 'searchContacts', 'The supplier or vendor for this bill', {
		required: true,
		displayOptions: {
			show: {
				resource: ['bill'],
				operation: ['create'],
			},
		},
	}),
	documentLinesProperty('bill'),
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['bill'],
				operation: ['create'],
			},
		},
		options: billOptionalFields,
	},

	/* -------------------------------------------------------------------------- */
	/*                                 bill:update                                */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['bill'],
				operation: ['update'],
			},
		},
		options: [
			...billOptionalFields,
			locator('Supplier', 'companyId', 'searchContacts', 'The supplier or vendor for this bill'),
		],
	},
	customFieldsProperty('bill'),

	/* -------------------------------------------------------------------------- */
	/*                                 bill:getAll                                */
	/* -------------------------------------------------------------------------- */
	...listProperties('bill'),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['bill'],
				operation: ['getAll'],
			},
		},
		options: [
			locator('Supplier', 'companyId', 'searchContacts', 'Only return bills for this supplier'),
			{
				displayName: 'Created After',
				name: 'dateFrom',
				type: 'dateTime',
				default: '',
				description: 'Only return bills dated on or after this date',
			},
			{
				displayName: 'Created Before',
				name: 'dateTo',
				type: 'dateTime',
				default: '',
				description: 'Only return bills dated on or before this date',
			},
			...modifiedDateFilters,
			locator('Project', 'projectId', 'searchProjects', 'Only return bills for this project'),
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'Paid',
						value: 'paid',
					},
					{
						name: 'Unpaid',
						value: 'unpaid',
					},
				],
				default: 'unpaid',
				description: 'Filter bills by status',
			},
			customFieldsFilterOption,
			customJsonFilterOption,
		],
	},
	listOptionsProperty('bill'),
];
