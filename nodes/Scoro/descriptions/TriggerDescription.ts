import type { INodeProperties } from 'n8n-workflow';

import { listOptionsProperty, listProperties } from './common';

export const triggerOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['trigger'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new trigger',
				action: 'Create a trigger',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a trigger',
				action: 'Delete a trigger',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a trigger by ID',
				action: 'Get a trigger',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many triggers',
				action: 'Get many triggers',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing trigger',
				action: 'Update a trigger',
			},
		],
		default: 'create',
	},
];

const moduleOptions = [
	{ name: 'Bill', value: 'bills' },
	{ name: 'Calendar Event', value: 'calendar' },
	{ name: 'Contact', value: 'contacts' },
	{ name: 'Expense', value: 'expenses' },
	{ name: 'Invoice', value: 'invoices' },
	{ name: 'Order', value: 'orders' },
	{ name: 'Project', value: 'projects' },
	{ name: 'Purchase Order', value: 'purchaseOrders' },
	{ name: 'Quote', value: 'quotes' },
	{ name: 'Task', value: 'tasks' },
];

const activityOptions = [
	{ name: 'Create', value: 'create' },
	{ name: 'Modify', value: 'modify' },
	{ name: 'Delete', value: 'delete' },
];

export const triggerFields: INodeProperties[] = [
	// Create required fields
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['trigger'],
				operation: ['create'],
			},
		},
		description: 'Trigger name',
	},
	{
		displayName: 'Module',
		name: 'module',
		type: 'options',
		required: true,
		options: moduleOptions,
		default: 'tasks',
		displayOptions: {
			show: {
				resource: ['trigger'],
				operation: ['create'],
			},
		},
		description: 'The Scoro module to trigger on',
	},
	{
		displayName: 'Webhook URL',
		name: 'urlToPost',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://...',
		displayOptions: {
			show: {
				resource: ['trigger'],
				operation: ['create'],
			},
		},
		description: 'The URL where Scoro sends webhook payloads when this trigger fires',
	},
	{
		displayName: 'Activities',
		name: 'activities',
		type: 'multiOptions',
		options: activityOptions,
		default: ['create', 'modify'],
		displayOptions: {
			show: {
				resource: ['trigger'],
				operation: ['create'],
			},
		},
		description: 'Record events that should trigger this webhook',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['trigger'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Is Shared',
				name: 'isShared',
				type: 'boolean',
				default: false,
				description: 'Whether this trigger is shared with other users',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Inactive', value: 'inactive' },
					{ name: 'Suspended', value: 'suspended' },
				],
				default: 'active',
				description: 'Trigger status',
			},
		],
	},

	// Update / Get / Delete
	{
		displayName: 'Trigger ID',
		name: 'triggerId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['trigger'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the trigger',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['trigger'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Activities',
				name: 'activities',
				type: 'multiOptions',
				options: activityOptions,
				default: [],
				description: 'Record events that should trigger this webhook',
			},
			{
				displayName: 'Is Shared',
				name: 'isShared',
				type: 'boolean',
				default: false,
				description: 'Whether this trigger is shared with other users',
			},
			{
				displayName: 'Module',
				name: 'module',
				type: 'options',
				options: moduleOptions,
				default: 'tasks',
				description: 'The Scoro module to trigger on',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Trigger name',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Inactive', value: 'inactive' },
					{ name: 'Suspended', value: 'suspended' },
				],
				default: 'active',
				description: 'Trigger status',
			},
			{
				displayName: 'Webhook URL',
				name: 'urlToPost',
				type: 'string',
				default: '',
				placeholder: 'https://...',
				description: 'The URL where Scoro sends webhook payloads when this trigger fires',
			},
		],
	},

	// Get Many
	...listProperties('trigger'),
	listOptionsProperty('trigger'),
];
