import type { INodeProperties } from 'n8n-workflow';

export const apiRequestOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['apiRequest'],
			},
		},
		options: [
			{
				name: 'Send',
				value: 'send',
				description: 'Call any Scoro API v2 endpoint',
				action: 'Send an API request',
			},
		],
		default: 'send',
	},
];

export const apiRequestFields: INodeProperties[] = [
	{
		displayName: 'Module',
		name: 'module',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. products',
		displayOptions: {
			show: {
				resource: ['apiRequest'],
			},
		},
		description: 'The Scoro API module name (e.g. products, bills, users)',
	},
	{
		displayName: 'Action',
		name: 'apiAction',
		type: 'options',
		options: [
			{
				name: 'Delete',
				value: 'delete',
			},
			{
				name: 'List',
				value: 'list',
			},
			{
				name: 'Modify',
				value: 'modify',
			},
			{
				name: 'Other',
				value: 'other',
			},
			{
				name: 'View',
				value: 'view',
			},
		],
		default: 'list',
		displayOptions: {
			show: {
				resource: ['apiRequest'],
			},
		},
		description: 'The Scoro action to execute',
	},
	{
		displayName: 'Action Name',
		name: 'actionName',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. pdf',
		displayOptions: {
			show: {
				resource: ['apiRequest'],
				apiAction: ['other'],
			},
		},
		description: 'The action name when Action is set to Other',
	},
	{
		displayName: 'Record ID',
		name: 'recordId',
		type: 'string',
		default: '',
		placeholder: 'e.g. 123',
		displayOptions: {
			show: {
				resource: ['apiRequest'],
				apiAction: ['delete', 'modify', 'view', 'other'],
			},
		},
		description: 'Record ID for view, modify, delete, or other actions',
	},
	{
		displayName: 'Request (JSON)',
		name: 'requestJson',
		type: 'json',
		default: '{}',
		displayOptions: {
			show: {
				resource: ['apiRequest'],
			},
		},
		description: 'JSON body payload sent under the "request" key',
	},
	{
		displayName: 'Filter (JSON)',
		name: 'filterJson',
		type: 'json',
		default: '{}',
		displayOptions: {
			show: {
				resource: ['apiRequest'],
				apiAction: ['list'],
			},
		},
		description: 'JSON filter object sent under the "filter" key for list actions',
	},
	{
		displayName: 'Additional Body Parameters (JSON)',
		name: 'bodyJson',
		type: 'json',
		default: '{}',
		displayOptions: {
			show: {
				resource: ['apiRequest'],
			},
		},
		description:
			'Additional JSON parameters merged into the top level. For example detailed_response, include_deleted or basic_data.',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['apiRequest'],
				operation: ['send'],
				apiAction: ['list'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['apiRequest'],
				operation: ['send'],
				apiAction: ['list'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
	},
];
