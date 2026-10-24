import type { INodeProperties } from 'n8n-workflow';

import { listOptionsProperty, listProperties, locator } from './common';

export const roleOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['role'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a role by ID',
				action: 'Get a role',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many roles',
				action: 'Get many roles',
			},
		],
		default: 'getAll',
	},
];

export const roleFields: INodeProperties[] = [
	locator('Role', 'roleId', 'searchRoles', 'The role to retrieve', {
		required: true,
		displayOptions: {
			show: {
				resource: ['role'],
				operation: ['get'],
			},
		},
	}),
	...listProperties('role'),
	listOptionsProperty('role'),
];
