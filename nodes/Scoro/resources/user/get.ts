import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUserGet = {
	operation: ['get'],
	resource: ['user'],
};

export const userGetDescription: INodeProperties[] = [
	{
		displayName: 'User',
		name: 'userId',
		type: 'resourceLocator',
		displayOptions: { show: showOnlyForUserGet },
		default: { mode: 'list', value: '' }, // 👈 Set default mode
		required: true,
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a user...',
				typeOptions: {
					searchListMethod: 'getUsers', // 👈 Point to the function we created
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'Enter User ID',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '^[0-9]+$', // Ensure it's a number
							errorMessage: 'User ID must be numeric',
						},
					},
				],
			},
		],
	},
];