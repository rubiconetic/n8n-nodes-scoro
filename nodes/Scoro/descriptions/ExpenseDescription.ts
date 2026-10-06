import type { INodeProperties } from 'n8n-workflow';

import {
	customFieldsFilterOption,
	customFieldsProperty,
	customJsonFilterOption,
	documentLinesProperty,
	listOptionsProperty,
	listProperties,
	locator,
	modifiedDateFilters,
} from './common';

export const expenseOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['expense'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new expense',
				action: 'Create an expense',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an expense',
				action: 'Delete an expense',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an expense by ID',
				action: 'Get an expense',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many expenses',
				action: 'Get many expenses',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing expense',
				action: 'Update an expense',
			},
		],
		default: 'create',
	},
];

const expenseOptionalFields: INodeProperties[] = [
	{
		displayName: 'Comment',
		name: 'comment',
		type: 'string',
		typeOptions: {
			rows: 3,
		},
		default: '',
		description: 'Description or comment for the expense',
	},
	locator('Contact Person', 'personId', 'searchContacts', 'Contact person for this expense'),
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'string',
		default: '',
		placeholder: 'e.g. EUR',
		description: 'Currency code (e.g. EUR, USD)',
	},
	{
		displayName: 'Due Date',
		name: 'dueDate',
		type: 'dateTime',
		default: '',
		description: 'Document due date',
	},
	{
		displayName: 'Expense Date',
		name: 'date',
		type: 'dateTime',
		default: '',
		description: 'Date of the expense',
	},
	{
		displayName: 'Expense Number',
		name: 'no',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Is Chargeable',
		name: 'isChargeable',
		type: 'boolean',
		default: false,
		description: 'Whether the expense is chargeable to a client',
	},
	{
		displayName: 'Is Reimbursable',
		name: 'isReimbursable',
		type: 'boolean',
		default: false,
		description: 'Whether the expense is reimbursable to the employee',
	},
	locator('Owner', 'ownerId', 'searchUsers', 'The owner / employee of the expense'),
	locator('Project', 'projectId', 'searchProjects', 'The project this expense belongs to'),
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		options: [
			{
				name: 'Paid',
				value: 'paid',
			},
			{
				name: 'Unpaid',
				value: 'unpaid',
			},
		],
		default: 'unpaid',
		description: 'Status of the expense',
	},
];

export const expenseFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                           expense:get / delete / update                    */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Expense ID',
		name: 'expenseId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['expense'],
				operation: ['get', 'delete', 'update'],
			},
		},
		description: 'The unique ID of the expense',
	},

	/* -------------------------------------------------------------------------- */
	/*                                expense:create                              */
	/* -------------------------------------------------------------------------- */
	locator('Issuer', 'companyId', 'searchContacts', 'The company or issuer for this expense', {
		required: true,
		displayOptions: {
			show: {
				resource: ['expense'],
				operation: ['create'],
			},
		},
	}),
	documentLinesProperty('expense'),
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['expense'],
				operation: ['create'],
			},
		},
		options: expenseOptionalFields,
	},

	/* -------------------------------------------------------------------------- */
	/*                                expense:update                              */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['expense'],
				operation: ['update'],
			},
		},
		options: [
			...expenseOptionalFields,
			locator('Issuer', 'companyId', 'searchContacts', 'The company or issuer for this expense'),
		],
	},
	customFieldsProperty('expense'),

	/* -------------------------------------------------------------------------- */
	/*                                expense:getAll                              */
	/* -------------------------------------------------------------------------- */
	...listProperties('expense'),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['expense'],
				operation: ['getAll'],
			},
		},
		options: [
			locator('Issuer', 'companyId', 'searchContacts', 'Only return expenses for this issuer'),
			{
				displayName: 'Created After',
				name: 'dateFrom',
				type: 'dateTime',
				default: '',
				description: 'Only return expenses dated on or after this date',
			},
			{
				displayName: 'Created Before',
				name: 'dateTo',
				type: 'dateTime',
				default: '',
				description: 'Only return expenses dated on or before this date',
			},
			...modifiedDateFilters,
			locator('Project', 'projectId', 'searchProjects', 'Only return expenses for this project'),
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'Paid',
						value: 'paid',
					},
					{
						name: 'Unpaid',
						value: 'unpaid',
					},
				],
				default: 'unpaid',
				description: 'Filter expenses by status',
			},
			customFieldsFilterOption,
			customJsonFilterOption,
		],
	},
	listOptionsProperty('expense'),
];
