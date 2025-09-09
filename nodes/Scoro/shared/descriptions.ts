import type { INodeProperties } from 'n8n-workflow';

// Reusable Limit Property
export const limitProperty: INodeProperties = {
    displayName: 'Page Limit', // Changed from "Limit" to "Page Limit"
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
    description: 'Max number of results to return'
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

// Reusable Filter Property
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
            value: '={{$value !== undefined && $value !== "" ? JSON.parse($value) : undefined}}',
        },
    },
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
            value: '={{$value !== undefined && $value !== "" ? JSON.parse($value) : undefined}}',
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

export const paginationProperty: INodeProperties = {
    displayName: 'Pagination',
    name: 'pagination',
    type: 'collection',
    placeholder: 'Add Pagination Option',
    default: {},
    options: [
        returnAllProperty,
        limitProperty,
    ],
}

export const batchingProperty: INodeProperties = {
    displayName: 'Batching',
    name: 'batching',
    type: 'collection',
    placeholder: 'Add Batching Option',
    default: {},
    options: [
        {
            displayName: 'Pages per Batch', // Changed from "Batch Size"
            name: 'batchSize',
            type: 'number',
            typeOptions: {
                minValue: 1,
            },
            default: 20, // Default to 1 page per batch
            description: 'The number of pages to request concurrently in each batch to avoid rate limits',
        },
        {
            // eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
            displayName: 'Batch Interval (ms)', // Changed from "Batch Interval"
            name: 'batchInterval',
            type: 'number',
            typeOptions: {
                minValue: 0,
            },
            default: 1000, // Default to 1 second
            description: 'The time to wait in milliseconds between each batch of requests',
        },
    ],
}

export const getManyOptionsProperty: INodeProperties = {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    options: [
        filterProperty,
        includeDeletedProperty,
        paginationProperty,
        batchingProperty
    ],
};