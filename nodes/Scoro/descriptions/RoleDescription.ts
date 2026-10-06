import type { INodeProperties } from 'n8n-workflow';

import { listOptionsProperty, listProperties } from './common';

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
	{
		displayName: 'Role ID',
		name: 'roleId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['role'],
				operation: ['get'],
			},
		},
		description: 'The ID of the role to retrieve',
	},
	...listProperties('role'),
	listOptionsProperty('role'),
];
