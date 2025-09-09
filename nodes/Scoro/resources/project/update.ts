import type { INodeProperties } from 'n8n-workflow';
import { requestProperty } from '../../shared/descriptions';

export const showOnlyForProjectUpdate = {
	operation: ['update'],
	resource: ['project'],
};

export const projectUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Project',
		name: 'projectId',
		type: 'resourceLocator',
		displayOptions: { show: showOnlyForProjectUpdate },
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
	{
		...requestProperty,
		displayOptions: {
			show: showOnlyForProjectUpdate,
		}
	}
];