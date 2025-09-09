import type { INodeProperties } from 'n8n-workflow';

const showOnlyForProjectCreate = {
	operation: ['create'],
	resource: ['project'],
};

export const projectCreateDescription: INodeProperties[] = [
	{
		displayName: 'Project Name',
		name: 'projectName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnlyForProjectCreate },
		routing: {
			send: {
				type: 'body',
				property: 'request.project_name',
			},
		},
	},
	{
		displayName: 'Company ID',
		name: 'companyId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: showOnlyForProjectCreate },
		routing: {
			send: {
				type: 'body',
				property: 'request.company_id',
			},
		},
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		required: true,
		default: 'inprogress',
		displayOptions: { show: showOnlyForProjectCreate },
		options: [
			{ name: 'Pending', value: 'pending' },
			{ name: 'In Progress', value: 'inprogress' },
			{ name: 'Cancelled', value: 'cancelled' },
			{ name: 'Completed', value: 'completed' },
		],
		routing: {
			send: {
				type: 'body',
				property: 'request.status',
			},
		},
	},
	// Add other fields like manager_id, deadline, etc., here
];