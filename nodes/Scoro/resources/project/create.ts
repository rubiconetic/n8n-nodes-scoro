import type { INodeProperties } from 'n8n-workflow';
import { requestProperty } from '../../shared/descriptions';

const showOnlyForProjectCreate = {
	operation: ['create'],
	resource: ['project'],
};

export const projectCreateDescription: INodeProperties[] = [
	{
		...requestProperty,
		displayOptions: {
			show: showOnlyForProjectCreate,
		},
		default: '{\n    "project_name": "",\n    "company_id": null,\n    "status": "inprogress"\n}',
		description: 'The request body for creating a project.',
	},
];