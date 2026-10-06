import type { INodeProperties } from 'n8n-workflow';

import {
	customFieldsProperty,
	listOptionsProperty,
	listProperties,
	locator,
	modifiedDateFilters,
} from './common';

export const taskOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['task'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new task',
				action: 'Create a task',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a task',
				action: 'Delete a task',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a task by ID',
				action: 'Get a task',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many tasks',
				action: 'Get many tasks',
			},
			{
				name: 'Set Done',
				value: 'setDone',
				description: 'Mark a task as completed',
				action: 'Mark a task as completed',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing task',
				action: 'Update a task',
			},
		],
		default: 'create',
	},
];

const taskOptionalFields: INodeProperties[] = [
	{
		displayName: 'Assignee Names or IDs',
		name: 'relatedUsers',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getUsers',
		},
		default: [],
		description:
			'Assignees for the task. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Billable Time Type',
		name: 'billableTimeType',
		type: 'options',
		options: [
			{
				name: 'Billable',
				value: 'billable',
			},
			{
				name: 'Custom',
				value: 'custom',
			},
			{
				name: 'Non-Billable',
				value: 'non_billable',
			},
		],
		default: 'billable',
		description: 'Whether the task hours are billable',
	},
	locator('Client', 'companyId', 'searchContacts', 'The company or person this task is for'),
	locator('Contact Person', 'personId', 'searchContacts', 'Contact person for this task'),
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		typeOptions: {
			rows: 3,
		},
		default: '',
		description: 'Description of the task',
	},
	{
		displayName: 'Due Date',
		name: 'datetimeDue',
		type: 'dateTime',
		default: '',
		description: 'Due date and time of the task',
	},
	{
		displayName: 'Is Completed',
		name: 'isCompleted',
		type: 'boolean',
		default: false,
		description: 'Whether the task is completed',
	},
	locator('Owner', 'ownerId', 'searchUsers', 'The owner of the task'),
	locator('Parent Task', 'parentId', 'searchTasks', 'Parent task ID if this is a subtask'),
	{
		displayName: 'Planned Duration',
		name: 'durationPlanned',
		type: 'string',
		default: '',
		placeholder: 'e.g. 01:00:00',
		description: 'Planned duration as HH:MM:SS',
	},
	{
		displayName: 'Priority',
		name: 'priorityId',
		type: 'options',
		options: [
			{
				name: 'High',
				value: 1,
			},
			{
				name: 'Low',
				value: 3,
			},
			{
				name: 'Normal',
				value: 2,
			},
		],
		default: 2,
		description: 'Priority of the task',
	},
	locator('Project', 'projectId', 'searchProjects', 'The project this task belongs to'),
	{
		displayName: 'Start Date',
		name: 'startDatetime',
		type: 'dateTime',
		default: '',
		description: 'Start date and time of the task',
	},
	{
		displayName: 'Status Name or ID',
		name: 'status',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getTaskStatuses',
		},
		default: '',
		description:
			'Current status of the task. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
];

export const taskFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                   task:get / delete / setDone / update                     */
	/* -------------------------------------------------------------------------- */
	locator('Task', 'taskId', 'searchTasks', 'The task to operate on', {
		required: true,
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['get', 'delete', 'setDone', 'update'],
			},
		},
	}),
	{
		displayName: 'Completed Date',
		name: 'completedDatetime',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['setDone'],
			},
		},
		description: 'Task completion timestamp (defaults to current time if empty)',
	},

	/* -------------------------------------------------------------------------- */
	/*                                 task:create                                */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Task Name',
		name: 'eventName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['create'],
			},
		},
		description: 'Name of the task',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['create'],
			},
		},
		options: taskOptionalFields,
	},

	/* -------------------------------------------------------------------------- */
	/*                                 task:update                                */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['update'],
			},
		},
		options: [
			...taskOptionalFields,
			{
				displayName: 'Task Name',
				name: 'eventName',
				type: 'string',
				default: '',
				description: 'Name of the task',
			},
		],
	},
	customFieldsProperty('task'),

	/* -------------------------------------------------------------------------- */
	/*                                 task:getAll                                */
	/* -------------------------------------------------------------------------- */
	...listProperties('task'),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['getAll'],
			},
		},
		options: [
			locator('Client', 'companyId', 'searchContacts', 'Only return tasks for this client'),
			{
				displayName: 'Due After',
				name: 'dueFrom',
				type: 'dateTime',
				default: '',
				description: 'Only return tasks due on or after this date',
			},
			{
				displayName: 'Due Before',
				name: 'dueTo',
				type: 'dateTime',
				default: '',
				description: 'Only return tasks due on or before this date',
			},
			{
				displayName: 'Is Completed',
				name: 'isCompleted',
				type: 'boolean',
				default: false,
				description: 'Whether to filter by completed status',
			},
			...modifiedDateFilters,
			locator('Owner', 'ownerId', 'searchUsers', 'Only return tasks owned by this user'),
			locator('Project', 'projectId', 'searchProjects', 'Only return tasks for this project'),
			{
				displayName: 'Status Name or ID',
				name: 'status',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getTaskStatuses',
				},
				default: '',
				description:
					'Filter tasks by status. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	},
	listOptionsProperty('task', [
		{
			displayName: 'Include Subtasks',
			name: 'includeSubtasks',
			type: 'boolean',
			default: false,
			description: 'Whether to also return subtasks',
		},
	]),
];
