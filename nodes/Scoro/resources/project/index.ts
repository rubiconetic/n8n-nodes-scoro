import type { INodeProperties } from 'n8n-workflow';
import { projectGetDescription } from './get';
import { projectGetManyDescription } from './getAll';
import { projectCreateDescription } from './create';
import { projectDeleteDescription } from './delete';
import { projectUpdateDescription } from './update';

const showOnlyForProjects = {
	resource: ['project'],
};

export const projectDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForProjects,
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a project',
				description: 'Create a new project',
				routing: {
					request: {
						method: 'POST',
						url: '/projects/modify',
						body: {
							request: {},
						},
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
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a project',
				description: 'Delete a project',
				routing: {
					request: {
						method: 'POST',
						url: '={{"/projects/delete/" + $parameter.projectId}}'
					}
				}
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a project',
				description: 'Get the data of a single project',
				routing: {
					request: {
						method: 'POST',
						url: '={{"/projects/view/" + $parameter.projectId}}',
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
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get projects',
				description: 'Get many projects',
				routing: {
					request: {
						method: 'POST',
						url: '/projects/list',
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
				name: 'Update',
				value: 'update',
				action: 'Update a project',
				description: 'Update an exisiting project',
				routing: {
					request: {
						method: 'POST',
						url: '={{"/projects/modify/" + $parameter.projectId}}',
						body: {
							request: '={{$parameter.request}}',
						},
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
	...projectGetDescription,
	...projectGetManyDescription,
	...projectCreateDescription,
	...projectDeleteDescription,
	...projectUpdateDescription,
];