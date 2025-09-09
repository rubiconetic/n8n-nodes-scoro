import type { INodeProperties } from 'n8n-workflow';

const showOnlyForProjectGet = {
	operation: ['get'],
	resource: ['project'],
};

export const projectGetDescription: INodeProperties[] = [
	{
		displayName: 'Project',
		name: 'projectId',
		type: 'resourceLocator',
		displayOptions: { show: showOnlyForProjectGet },
		default: { mode: 'list', value: '' },
		required: true,
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a project...',
				typeOptions: {
					searchListMethod: 'getProjects',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'Enter Project ID',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '^[0-9]+$',
							errorMessage: 'Project ID must be numeric',
						},
					},
				],
			},
		],
	},
];