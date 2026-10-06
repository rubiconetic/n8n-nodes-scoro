import type { INodeProperties } from 'n8n-workflow';

import { listOptionsProperty, listProperties, locator } from './common';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a user by ID',
				action: 'Get a user',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many users',
				action: 'Get many users',
			},
		],
		default: 'getAll',
	},
];

export const userFields: INodeProperties[] = [
	locator('User', 'userId', 'searchUsers', 'The user to retrieve', {
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['get'],
			},
		},
		required: true,
	}),
	...listProperties('user'),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Inactive', value: 'inactive' },
					{ name: 'Pending', value: 'pending' },
					{ name: 'Awaiting', value: 'awaiting' },
				],
				default: 'active',
				description: 'Filter users by status',
			},
		],
	},
	listOptionsProperty('user'),
];
