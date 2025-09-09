import type { INodeProperties } from 'n8n-workflow';
import { userGetDescription } from './get';
import { userGetManyDescription } from './getAll';

const showOnlyForUsers = {
	resource: ['user'],
};

export const userDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForUsers,
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get users',
				description: 'Get many users',
				routing: {
					request: {
						method: 'POST',
						url: '/users/list',
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								enabled: '={{ $parameter.splitOutput }}',
								properties: {
									property: 'data',
								}
							},
							{
								type: 'set',
								enabled: '={{ !$parameter.splitOutput }}',
								properties: {
									value: '={{ $response.body }}',
								}
							}
						]
					}
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a user',
				description: 'Get the data of a single user',
				routing: {
					request: {
						method: 'POST',
						url: '={{"/users/view/" + $parameter.userId}}',
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								enabled: true,
								properties: {
									property: 'data',
								}

							}
						]
					}
				},

			},
		],
		default: 'getAll',
	},
	...userGetDescription,
	...userGetManyDescription,
];