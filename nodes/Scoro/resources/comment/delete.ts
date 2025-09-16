import type { INodeProperties } from 'n8n-workflow';

export const showOnlyForCommentDelete = {
    operation: ['delete'],
    resource: ['comment'],
};

export const commentDeleteDescription: INodeProperties[] = [
    {
        displayName: 'Comment ID',
        name: 'commentId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: showOnlyForCommentDelete },
        description: 'The ID of the comment to delete',
    },
];