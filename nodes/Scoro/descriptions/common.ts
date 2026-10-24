import type { INodeProperties } from 'n8n-workflow';

type SearchMethod =
	| 'searchBills'
	| 'searchCalendarEvents'
	| 'searchClientProfiles'
	| 'searchContacts'
	| 'searchCustomFields'
	| 'searchExpenses'
	| 'searchInvoices'
	| 'searchOrders'
	| 'searchPdfTemplates'
	| 'searchProducts'
	| 'searchProjects'
	| 'searchPurchaseOrders'
	| 'searchQuotes'
	| 'searchRoles'
	| 'searchTasks'
	| 'searchUsers';

/** A "From List / By ID" picker. Read its value in execute with toId(). */
export function locator(
	displayName: string,
	name: string,
	searchListMethod: SearchMethod,
	description: string,
	extra: Partial<INodeProperties> = {},
): INodeProperties {
	return {
		displayName,
		name,
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		description,
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod,
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. 123',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '^[0-9]+$',
							errorMessage: 'The ID must be a number',
						},
					},
				],
			},
		],
		...extra,
	};
}

/** A "From List / By ID" picker for custom field string IDs (e.g. "c_account_tier"). */
export function customFieldLocator(description: string): INodeProperties {
	return {
		displayName: 'Field',
		name: 'id',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		description,
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'searchCustomFields',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. c_myfield',
			},
		],
	};
}

/** The standard Return All + Limit pair for a Get Many operation. */
export function listProperties(resource: string): INodeProperties[] {
	return [
		{
			displayName: 'Return All',
			name: 'returnAll',
			type: 'boolean',
			displayOptions: {
				show: {
					resource: [resource],
					operation: ['getAll'],
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
					resource: [resource],
					operation: ['getAll'],
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
}

/** Custom field values for create and update. Read with buildCustomFields(). */
export function customFieldsProperty(resource: string): INodeProperties {
	return {
		displayName: 'Custom Fields',
		name: 'customFieldsUi',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Custom Field',
		default: {},
		displayOptions: {
			show: {
				resource: [resource],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				name: 'field',
				displayName: 'Field',
				values: [
					customFieldLocator(
						'The custom field as configured in Scoro, including the "c_" prefix when entering by ID',
					),
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
					},
				],
			},
		],
	};
}

/** Modified-date range filters shared by every Get Many "Filters" collection. */
export const modifiedDateFilters: INodeProperties[] = [
	{
		displayName: 'Modified After',
		name: 'modifiedFrom',
		type: 'dateTime',
		default: '',
		description: 'Only return records modified on or after this date',
	},
	{
		displayName: 'Modified Before',
		name: 'modifiedTo',
		type: 'dateTime',
		default: '',
		description: 'Only return records modified on or before this date',
	},
];

/** Custom field values for Get Many filters. Read with buildCustomFieldsFilter(). */
export const customFieldsFilterOption: INodeProperties = {
	displayName: 'Custom Fields',
	name: 'customFieldsUi',
	type: 'fixedCollection',
	typeOptions: {
		multipleValues: true,
	},
	placeholder: 'Add Custom Field Filter',
	default: {},
	options: [
		{
			name: 'field',
			displayName: 'Custom Field',
			values: [
				customFieldLocator(
					'The custom field as configured in Scoro, including the "c_" prefix when entering by ID',
				),
				{
					displayName: 'Value',
					name: 'value',
					type: 'string',
					default: '',
					description: 'Value to filter by. Supports % wildcard.',
				},
			],
		},
	],
};

/** Additional custom filters formatted as JSON. Merged directly into Scoro filter object. */
export const customJsonFilterOption: INodeProperties = {
	displayName: 'Custom Filters (JSON)',
	name: 'customFiltersJson',
	type: 'json',
	default: '',
	placeholder: '{\n  "tag_ids": [123, 456]\n}',
	description:
		'Additional Scoro filter parameters as JSON. Merged directly into the filter object.',
};

/** Options shared by Get Many operations. Read with applyListOptions(). */
export function listOptionsProperty(
	resource: string,
	extraOptions: INodeProperties[] = [],
): INodeProperties {
	return {
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add option',
		default: {},
		displayOptions: {
			show: {
				resource: [resource],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Detailed Response',
				name: 'detailedResponse',
				type: 'boolean',
				default: false,
				description:
					'Whether to return every field that the Get operation returns. Slower: Scoro then returns at most 25 records per request.',
			},
			{
				displayName: 'Include Deleted',
				name: 'includeDeleted',
				type: 'boolean',
				default: false,
				description: 'Whether to also return records deleted within the last 30 days',
			},
			...extraOptions,
		],
	};
}

/** Notice shown on document Update operations warning that setting Line Items replaces existing lines. */
export function documentLinesUpdateNotice(resource: string): INodeProperties {
	return {
		displayName:
			'Updating line items replaces all existing lines on this document. Include every line you want to keep (with its Line ID), or leave Line Items empty to keep existing lines unchanged.',
		name: 'linesUpdateNotice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				resource: [resource],
				operation: ['update'],
			},
		},
	};
}

/** Line items for financial documents. Read with buildLines(). */
export function documentLinesProperty(resource: string): INodeProperties {
	return {
		displayName: 'Line Items',
		name: 'linesUi',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Line Item',
		default: {},
		description:
			'Document line items. On Update, setting any line item replaces all existing lines on the document (leave empty to keep existing lines unchanged).',
		displayOptions: {
			show: {
				resource: [resource],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				name: 'lineValues',
				displayName: 'Line Item',
				values: [
					{
						displayName: 'Amount',
						name: 'amount',
						type: 'number',
						default: 1,
						description: 'Quantity',
					},
					{
						displayName: 'Comment',
						name: 'comment',
						type: 'string',
						default: '',
						description: 'Line text',
					},
					{
						displayName: 'Discount Percent',
						name: 'discount',
						type: 'string',
						default: '',
						placeholder: 'e.g. 10',
						description: 'Sent only when filled',
					},
					{
						displayName: 'Line ID',
						name: 'id',
						type: 'string',
						default: '',
						description: 'Set only when updating an existing line',
					},
					locator('Product', 'productId', 'searchProducts', 'The product or service for this line'),
					{
						displayName: 'Unit',
						name: 'unit',
						type: 'string',
						default: '',
						placeholder: 'e.g. h',
					},
					{
						displayName: 'Unit Price',
						name: 'price',
						type: 'number',
						default: 0,
					},
					{
						displayName: 'VAT Percent',
						name: 'vat',
						type: 'string',
						default: '',
						description: "Leave empty to use the product's default VAT",
					},
				],
			},
		],
	};
}
