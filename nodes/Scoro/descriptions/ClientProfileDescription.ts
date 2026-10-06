import type { INodeProperties } from 'n8n-workflow';

import { listOptionsProperty, listProperties } from './common';

export const clientProfileOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['clientProfile'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new client profile',
				action: 'Create a client profile',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a client profile',
				action: 'Delete a client profile',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a client profile by ID',
				action: 'Get a client profile',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many client profiles',
				action: 'Get many client profiles',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing client profile',
				action: 'Update a client profile',
			},
		],
		default: 'create',
	},
];

const clientProfileOptionalFields: INodeProperties[] = [
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'string',
		default: '',
		placeholder: 'e.g. EUR, USD',
		description: 'ISO 4217 currency code',
	},
	{
		displayName: 'Deadline Days',
		name: 'deadlineDays',
		type: 'number',
		default: 14,
		description: 'Invoice due date in days',
	},
	{
		displayName: 'Discount (%)',
		name: 'discount',
		type: 'number',
		default: 0,
		description: 'Overall discount percentage',
	},
	{
		displayName: 'Discount 2 (%)',
		name: 'discount2',
		type: 'number',
		default: 0,
		description: 'First additional discount percentage',
	},
	{
		displayName: 'Discount 3 (%)',
		name: 'discount3',
		type: 'number',
		default: 0,
		description: 'Second additional discount percentage',
	},
	{
		displayName: 'Fine (%)',
		name: 'fine',
		type: 'number',
		default: 0,
		description: 'Overdue interest percentage',
	},
	{
		displayName: 'Language ID',
		name: 'languageId',
		type: 'string',
		default: '',
		description: 'Language code or ID',
	},
	{
		displayName: 'Payment Type',
		name: 'paymentType',
		type: 'options',
		options: [
			{ name: 'Bank Transfer', value: 'banktransfer' },
			{ name: 'Barter', value: 'barter' },
			{ name: 'Card Payment', value: 'card payment' },
			{ name: 'Cash', value: 'cash' },
			{ name: 'Credit', value: 'credit' },
		],
		default: 'banktransfer',
		description: 'Default payment method',
	},
	{
		displayName: 'Price List ID',
		name: 'priceListId',
		type: 'number',
		default: 0,
		description: 'Associated price list ID',
	},
	{
		displayName: 'VAT Code ID',
		name: 'vatCodeId',
		type: 'number',
		default: 0,
		description: 'Tax rate ID',
	},
];

export const clientProfileFields: INodeProperties[] = [
	// Create: name required
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['clientProfile'],
				operation: ['create'],
			},
		},
		description: 'Client profile name',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['clientProfile'],
				operation: ['create'],
			},
		},
		options: clientProfileOptionalFields,
	},

	// Update / Get / Delete: clientProfileId required
	{
		displayName: 'Client Profile ID',
		name: 'clientProfileId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['clientProfile'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the client profile',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['clientProfile'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Client profile name',
			},
			...clientProfileOptionalFields,
		],
	},

	// Get Many
	...listProperties('clientProfile'),
	listOptionsProperty('clientProfile'),
];
