import type { INodeProperties } from 'n8n-workflow';

import {
	customFieldsFilterOption,
	customFieldsProperty,
	customJsonFilterOption,
	listOptionsProperty,
	listProperties,
	locator,
	modifiedDateFilters,
} from './common';

export const projectOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['project'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new project',
				action: 'Create a project',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a project',
				action: 'Delete a project',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a project by ID',
				action: 'Get a project',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many projects',
				action: 'Get many projects',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing project',
				action: 'Update a project',
			},
		],
		default: 'create',
	},
];

const projectOptionalFields: INodeProperties[] = [
	locator('Client', 'companyId', 'searchContacts', 'The company or person this project is for'),
	{
		displayName: 'Deadline',
		name: 'deadline',
		type: 'dateTime',
		default: '',
		description: 'Deadline for the project',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		typeOptions: {
			rows: 3,
		},
		default: '',
		description: 'Description of the project',
	},
	{
		displayName: 'Estimated Duration',
		name: 'duration',
		type: 'string',
		default: '',
		placeholder: 'e.g. 04:30:00',
		description: 'Estimated duration as HH:MM:SS',
	},
	{
		displayName: 'Is Private',
		name: 'isPrivate',
		type: 'boolean',
		default: false,
		description: 'Whether the project is private to project members',
	},
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		default: '',
		description: 'Date the project starts',
	},
	{
		displayName: 'Status Name or ID',
		name: 'status',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getProjectStatuses',
		},
		default: '',
		description:
			'Current status of the project. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Tags',
		name: 'tags',
		type: 'string',
		default: '',
		placeholder: 'e.g. internal,q3',
		description: 'Comma-separated list of tags',
	},
];

export const projectFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                         project:get / delete / update                      */
	/* -------------------------------------------------------------------------- */
	locator('Project', 'projectId', 'searchProjects', 'The project to operate on', {
		required: true,
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['get', 'delete', 'update'],
			},
		},
	}),

	/* -------------------------------------------------------------------------- */
	/*                               project:create                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Project Name',
		name: 'projectName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['create'],
			},
		},
		description: 'Name of the project',
	},
	locator(
		'Project Manager',
		'managerId',
		'searchUsers',
		'The Scoro user managing the project. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		{
			required: true,
			displayOptions: {
				show: {
					resource: ['project'],
					operation: ['create'],
				},
			},
		},
	),
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['create'],
			},
		},
		options: projectOptionalFields,
	},

	/* -------------------------------------------------------------------------- */
	/*                               project:update                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['update'],
			},
		},
		options: [
			locator('Client', 'companyId', 'searchContacts', 'The company or person this project is for'),
			{
				displayName: 'Deadline',
				name: 'deadline',
				type: 'dateTime',
				default: '',
				description: 'Deadline for the project',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				default: '',
				description: 'Description of the project',
			},
			{
				displayName: 'Estimated Duration',
				name: 'duration',
				type: 'string',
				default: '',
				placeholder: 'e.g. 04:30:00',
				description: 'Estimated duration as HH:MM:SS',
			},
			{
				displayName: 'Is Private',
				name: 'isPrivate',
				type: 'boolean',
				default: false,
				description: 'Whether the project is private to project members',
			},
			locator(
				'Project Manager',
				'managerId',
				'searchUsers',
				'The Scoro user managing the project. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			),
			{
				displayName: 'Project Name',
				name: 'projectName',
				type: 'string',
				default: '',
				description: 'Name of the project',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Date the project starts',
			},
			{
				displayName: 'Status Name or ID',
				name: 'status',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getProjectStatuses',
				},
				default: '',
				description:
					'Current status of the project. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				placeholder: 'e.g. internal,q3',
				description: 'Comma-separated list of tags',
			},
		],
	},
	customFieldsProperty('project'),

	/* -------------------------------------------------------------------------- */
	/*                               project:getAll                               */
	/* -------------------------------------------------------------------------- */
	...listProperties('project'),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['getAll'],
			},
		},
		options: [
			locator('Client', 'companyId', 'searchContacts', 'Only return projects for this client'),
			...modifiedDateFilters,
			locator(
				'Project Manager',
				'managerId',
				'searchUsers',
				'Only return projects managed by this user. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			),
			{
				displayName: 'Project Name',
				name: 'projectName',
				type: 'string',
				default: '',
				placeholder: 'e.g. Acme%',
				description: 'Name to match. Use % as a wildcard.',
			},
			{
				displayName: 'Status Name or ID',
				name: 'status',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getProjectStatuses',
				},
				default: '',
				description:
					'Filter projects by status. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			customFieldsFilterOption,
			customJsonFilterOption,
		],
	},
	listOptionsProperty('project'),
];
