import type { INodeProperties } from 'n8n-workflow';

import { listOptionsProperty, listProperties, locator, modifiedDateFilters } from './common';

export const commentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['comment'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a comment on an object',
				action: 'Create a comment',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a comment',
				action: 'Delete a comment',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many comments',
				action: 'Get many comments',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a comment',
				action: 'Update a comment',
			},
		],
		default: 'create',
	},
];

const moduleOptions = [
	{ name: 'Contacts', value: 'contacts' },
	{ name: 'Events', value: 'events' },
	{ name: 'Invoices', value: 'invoices' },
	{ name: 'Projects', value: 'projects' },
	{ name: 'Quotes', value: 'quotes' },
	{ name: 'Tasks', value: 'tasks' },
];

export const commentFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                         comment:delete                                     */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Comment ID',
		name: 'commentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['comment'],
				operation: ['delete', 'update'],
			},
		},
		description: 'The ID of the comment to operate on',
	},

	/* -------------------------------------------------------------------------- */
	/*                         comment:create                                     */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Module',
		name: 'module',
		type: 'options',
		options: moduleOptions,
		required: true,
		default: 'tasks',
		displayOptions: {
			show: {
				resource: ['comment'],
				operation: ['create'],
			},
		},
		description: 'The module the object belongs to',
	},
	{
		displayName: 'Object ID',
		name: 'objectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['comment'],
				operation: ['create'],
			},
		},
		description: 'The ID of the object (task, project, contact, etc.) to attach the comment to',
	},
	{
		displayName: 'Comment',
		name: 'comment',
		type: 'string',
		typeOptions: {
			rows: 3,
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['comment'],
				operation: ['create'],
			},
		},
		description: 'The content of the comment',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['comment'],
				operation: ['create'],
			},
		},
		options: [
			locator(
				'Author',
				'userId',
				'searchUsers',
				'The Scoro user creating the comment. Mandatory when using API key authentication.',
			),
		],
	},

	/* -------------------------------------------------------------------------- */
	/*                         comment:update                                     */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Comment',
		name: 'comment',
		type: 'string',
		typeOptions: {
			rows: 3,
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['comment'],
				operation: ['update'],
			},
		},
		description: 'The updated content of the comment',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['comment'],
				operation: ['update'],
			},
		},
		options: [
			locator('Author', 'userId', 'searchUsers', 'The Scoro user authoring the comment update'),
		],
	},

	/* -------------------------------------------------------------------------- */
	/*                         comment:getAll                                     */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Module',
		name: 'module',
		type: 'options',
		options: moduleOptions,
		required: true,
		default: 'tasks',
		displayOptions: {
			show: {
				resource: ['comment'],
				operation: ['getAll'],
			},
		},
		description: 'The module the object belongs to',
	},
	{
		displayName: 'Object ID',
		name: 'objectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['comment'],
				operation: ['getAll'],
			},
		},
		description: 'The ID of the object whose comments you want to retrieve',
	},
	...listProperties('comment'),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['comment'],
				operation: ['getAll'],
			},
		},
		options: [
			locator('Author', 'userId', 'searchUsers', 'Only return comments written by this user'),
			...modifiedDateFilters,
		],
	},
	listOptionsProperty('comment'),
];
