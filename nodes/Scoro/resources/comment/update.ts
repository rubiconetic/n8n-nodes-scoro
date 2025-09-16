// Scoro/resources/comment/update.ts

import type { INodeProperties } from 'n8n-workflow';

export const showOnlyForCommentUpdate = {
    operation: ['update'],
    resource: ['comment'],
};

export const commentUpdateDescription: INodeProperties[] = [
    {
        displayName: 'Module',
        name: 'module',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: showOnlyForCommentUpdate,
        },
        description: 'The module to which the comment belongs (e.g., tasks, projects)',
    },
    {
        displayName: 'Object ID',
        name: 'objectId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: showOnlyForCommentUpdate,
        },
        description: 'The ID of the object within the module',
    },
    {
        displayName: 'Comment ID',
        name: 'commentId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: showOnlyForCommentUpdate,
        },
    },
    {
        displayName: 'User ID',
        name: 'userId',
        type: 'string',
        default: '',
        displayOptions: {
            show: showOnlyForCommentUpdate,
        },
        description: 'The ID of the comment owner. Mandatory when using API Key authentication.',
    },
    {
        displayName: 'Comment',
        name: 'comment',
        type: 'string',
        default: '',
        displayOptions: {
            show: showOnlyForCommentUpdate,
        },
        description: 'The updated content of the comment',
    },
    {
        // Legacy 'request' property for backwards compatibility
        displayName: 'Request',
        name: 'request',
        type: 'json',
        displayOptions: {
            show: {
                // Hides this property from the UI
                resource: [],
            },
        },
        default: '',
    },
];