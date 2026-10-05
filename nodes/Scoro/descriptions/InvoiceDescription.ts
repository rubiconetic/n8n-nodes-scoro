import type { INodeProperties } from 'n8n-workflow';

import {
	customFieldsProperty,
	documentLinesProperty,
	listOptionsProperty,
	listProperties,
	locator,
	modifiedDateFilters,
} from './common';

export const invoiceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['invoice'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new invoice',
				action: 'Create an invoice',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an invoice',
				action: 'Delete an invoice',
			},
			{
				name: 'Generate PDF',
				value: 'getPdf',
				description: 'Ask Scoro to generate the PDF of an invoice',
				action: 'Generate an invoice PDF',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an invoice by ID',
				action: 'Get an invoice',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many invoices',
				action: 'Get many invoices',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing invoice',
				action: 'Update an invoice',
			},
		],
		default: 'create',
	},
];

const invoiceOptionalFields: INodeProperties[] = [
	locator('Contact Person', 'personId', 'searchContacts', 'Contact person for this invoice'),
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
		description: 'Description or notes for the invoice header',
	},
	{
		displayName: 'Discount Percent',
		name: 'discount',
		type: 'number',
		default: 0,
		description: 'Discount percentage for the entire invoice',
	},
	{
		displayName: 'Due Date',
		name: 'deadline',
		type: 'dateTime',
		default: '',
		description: 'Payment due date',
	},
	{
		displayName: 'Invoice Date',
		name: 'date',
		type: 'dateTime',
		default: '',
		description: 'Date of the invoice',
	},
	{
		displayName: 'Invoice Number',
		name: 'no',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Is Sent',
		name: 'isSent',
		type: 'boolean',
		default: false,
		description: 'Whether the invoice is marked as sent',
	},
	locator('Owner', 'ownerId', 'searchUsers', 'The owner of the invoice'),
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
	locator('Project', 'projectId', 'searchProjects', 'The project this invoice belongs to'),
	{
		displayName: 'Reference Number',
		name: 'referenceNo',
		type: 'string',
		default: '',
		description: 'Reference number for payment',
	},
];

export const invoiceFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                        invoice:get / delete / update / getPdf              */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Invoice ID',
		name: 'invoiceId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['get', 'delete', 'update', 'getPdf'],
			},
		},
		description: 'The unique ID of the invoice',
	},
	{
		displayName: 'Template ID',
		name: 'templateId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['getPdf'],
			},
		},
		description: 'The ID of the PDF template to use',
	},

	/* -------------------------------------------------------------------------- */
	/*                               invoice:create                               */
	/* -------------------------------------------------------------------------- */
	locator('Client', 'companyId', 'searchContacts', 'The client this invoice is for', {
		required: true,
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['create'],
			},
		},
	}),
	documentLinesProperty('invoice'),
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['create'],
			},
		},
		options: invoiceOptionalFields,
	},

	/* -------------------------------------------------------------------------- */
	/*                               invoice:update                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['update'],
			},
		},
		options: [
			locator('Client', 'companyId', 'searchContacts', 'The client this invoice is for'),
			...invoiceOptionalFields,
		],
	},
	customFieldsProperty('invoice'),

	/* -------------------------------------------------------------------------- */
	/*                               invoice:getAll                               */
	/* -------------------------------------------------------------------------- */
	...listProperties('invoice'),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['getAll'],
			},
		},
		options: [
			locator('Client', 'companyId', 'searchContacts', 'Only return invoices for this client'),
			{
				displayName: 'Dated After',
				name: 'dateFrom',
				type: 'dateTime',
				default: '',
				description: 'Only return invoices dated on or after this date',
			},
			{
				displayName: 'Dated Before',
				name: 'dateTo',
				type: 'dateTime',
				default: '',
				description: 'Only return invoices dated on or before this date',
			},
			...modifiedDateFilters,
			locator('Project', 'projectId', 'searchProjects', 'Only return invoices for this project'),
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
				default: 'paid',
				description: 'Filter invoices by status',
			},
		],
	},
	listOptionsProperty('invoice'),
];
