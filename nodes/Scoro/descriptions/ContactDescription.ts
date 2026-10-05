import type { INodeProperties } from 'n8n-workflow';

import {
	customFieldsProperty,
	listOptionsProperty,
	listProperties,
	locator,
	modifiedDateFilters,
} from './common';

export const contactOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['contact'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new company or person',
				action: 'Create a contact',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a contact',
				action: 'Delete a contact',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a contact by ID',
				action: 'Get a contact',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many contacts',
				action: 'Get many contacts',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing contact',
				action: 'Update a contact',
			},
		],
		default: 'create',
	},
];

const contactTypeOptions = [
	{
		name: 'Company',
		value: 'company',
	},
	{
		name: 'Person',
		value: 'person',
	},
];

// Optional fields shared by Create ("Additional Fields") and Update ("Update Fields").
// Keep this list alphabetical by displayName.
const contactOptionalFields: INodeProperties[] = [
	{
		displayName: 'Bank Account',
		name: 'bankAccount',
		type: 'string',
		default: '',
	},
	{
		displayName: 'City',
		name: 'city',
		type: 'string',
		default: '',
		description: 'City of the address',
	},
	{
		displayName: 'Comments',
		name: 'comments',
		type: 'string',
		typeOptions: {
			rows: 3,
		},
		default: '',
	},
	{
		displayName: 'Country',
		name: 'country',
		type: 'string',
		default: '',
		placeholder: 'e.g. est',
		description: 'Country of the address as a 3-letter ISO 3166 code',
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'e.g. nathan@example.com',
		default: '',
	},
	{
		displayName: 'ID Code',
		name: 'idCode',
		type: 'string',
		default: '',
		description: 'Company registration number or personal ID code',
	},
	{
		displayName: 'Is Client',
		name: 'isClient',
		type: 'boolean',
		default: true,
		description: 'Whether the contact is a client',
	},
	{
		displayName: 'Is Supplier',
		name: 'isSupplier',
		type: 'boolean',
		default: false,
		description: 'Whether the contact is a supplier',
	},
	{
		displayName: 'Last Name',
		name: 'lastName',
		type: 'string',
		default: '',
		placeholder: 'e.g. Smith',
		description: 'Only used when the contact is a person',
	},
	locator('Manager', 'managerId', 'searchUsers', 'The Scoro user who manages this contact'),
	{
		displayName: 'Mobile Phone',
		name: 'mobile',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Phone',
		name: 'phone',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Position',
		name: 'position',
		type: 'string',
		default: '',
		placeholder: 'e.g. CEO',
		description: 'Job title of a person',
	},
	{
		displayName: 'Reference Number',
		name: 'referenceNo',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Street',
		name: 'street',
		type: 'string',
		default: '',
		description: 'Street of the address',
	},
	{
		displayName: 'Tags',
		name: 'tags',
		type: 'string',
		default: '',
		placeholder: 'e.g. vip,partner',
		description: 'Comma-separated list of tags',
	},
	{
		displayName: 'VAT Number',
		name: 'vatNo',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Website',
		name: 'website',
		type: 'string',
		default: '',
		placeholder: 'e.g. https://example.com',
	},
	{
		displayName: 'ZIP Code',
		name: 'zipcode',
		type: 'string',
		default: '',
		description: 'Postal code of the address',
	},
];

export const contactFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                         contact:get / delete / update                      */
	/* -------------------------------------------------------------------------- */
	locator('Contact', 'contactId', 'searchContacts', 'The contact to operate on', {
		required: true,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['get', 'delete', 'update'],
			},
		},
	}),

	/* -------------------------------------------------------------------------- */
	/*                               contact:create                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Contact Type',
		name: 'contactType',
		type: 'options',
		options: contactTypeOptions,
		default: 'company',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create'],
			},
		},
		description: 'Whether to create a company or a person',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create'],
			},
		},
		description: 'Company name, or the first name of a person',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create'],
			},
		},
		options: contactOptionalFields,
	},

	/* -------------------------------------------------------------------------- */
	/*                               contact:update                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Address ID',
				name: 'addressId',
				type: 'string',
				default: '',
				description:
					'ID of the existing address to change. Without it, the address fields create a new address and Scoro may remove addresses that are not sent.',
			},
			{
				displayName: 'Contact Type',
				name: 'contactType',
				type: 'options',
				options: contactTypeOptions,
				default: 'company',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Company name, or the first name of a person',
			},
			...contactOptionalFields,
		],
	},
	customFieldsProperty('contact'),

	/* -------------------------------------------------------------------------- */
	/*                               contact:getAll                               */
	/* -------------------------------------------------------------------------- */
	...listProperties('contact'),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Contact Type',
				name: 'contactType',
				type: 'options',
				options: contactTypeOptions,
				default: 'company',
			},
			{
				displayName: 'Is Client',
				name: 'isClient',
				type: 'boolean',
				default: true,
				description: 'Whether to return only clients (on) or only non-clients (off)',
			},
			{
				displayName: 'Is Supplier',
				name: 'isSupplier',
				type: 'boolean',
				default: true,
				description: 'Whether to return only suppliers (on) or only non-suppliers (off)',
			},
			locator('Manager', 'managerId', 'searchUsers', 'Only return contacts managed by this user'),
			...modifiedDateFilters,
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				placeholder: 'e.g. Acme%',
				description: 'Name to match. Use % as a wildcard, for example "Acme%".',
			},
		],
	},
	listOptionsProperty('contact'),
];
