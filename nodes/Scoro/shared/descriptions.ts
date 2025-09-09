import type { INodeProperties } from 'n8n-workflow';

// Reusable Limit Property
export const limitProperty: INodeProperties = {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
        show: {
            returnAll: [false],
        },
    },
    typeOptions: {
        minValue: 1,
    },
    default: 50,
    routing: {
        send: {
            type: 'body',
            property: 'request.limit',
        },
    },
    description: 'Max number of results to return',
};

// Reusable Return All Property
export const returnAllProperty: INodeProperties = {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    description: 'Whether to return all results or only up to a given limit',
};

// Reusable Include Deleted Property
export const includeDeletedProperty: INodeProperties = {
    displayName: 'Include Deleted',
    name: 'includeDeleted',
    type: 'boolean',
    default: false,
    description: 'Whether to include entries that have been deleted in the last 30 days',
    routing: {
        send: {
            type: 'body',
            property: 'include_deleted',
            value: '={{$value ? "1" : undefined}}',
        },
    },
};

// Reusable Filter Property (with your working tweak)
export const filterProperty: INodeProperties = {
    displayName: 'Filter',
    name: 'filter',
    type: 'json',
    default: '',
    placeholder: '{\n    "modified_date": {\n        "from_date": "2023-01-01"\n    }\n}',
    description: 'A JSON object to use for filtering results',
    routing: {
        send: {
            type: 'body',
            property: 'filter',
            value: '={{JSON.parse($value)}}',
        },
    },
    options: [
        includeDeletedProperty
    ]
};


export const requestProperty: INodeProperties = {
    displayName: 'Request',
    name: 'request',
    type: 'json',
    default: '',
    placeholder: 'A JSON object representing the nested request',
    routing: {
        send: {
            type: 'body',
            property: 'request',
            value: '={{JSON.parse($value)}}',
        }
    }

}

export const splitOutputProperty: INodeProperties = {
    displayName: 'Split Output',
    name: 'splitOutput',
    type: 'boolean',
    default: true,
    description:
        'Whether to split output into multiple items. If disabled, all data will be returned as one item.',
};

export const getManyOptionsProperty: INodeProperties = {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    options: [
        filterProperty,
        includeDeletedProperty,
    ],
};