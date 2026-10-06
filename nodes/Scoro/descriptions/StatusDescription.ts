import type { INodeProperties } from 'n8n-workflow';

import { listOptionsProperty, listProperties } from './common';

export const statusOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['status'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get statuses for modules',
				action: 'Get many statuses',
			},
		],
		default: 'getAll',
	},
];

export const statusFields: INodeProperties[] = [
	...listProperties('status'),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['status'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Module',
				name: 'module',
				type: 'options',
				options: [
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
				],
				default: 'tasks',
				description: 'Module to get statuses for. If omitted, returns all statuses.',
			},
		],
	},
	listOptionsProperty('status'),
];
