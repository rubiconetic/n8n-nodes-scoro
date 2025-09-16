import type { INodeProperties } from 'n8n-workflow';
import { commentGetManyDescription } from './getAll';
import { commentCreateDescription } from './create';
import { commentDeleteDescription } from './delete';
import { commentUpdateDescription } from './update';

const showOnlyForComment = {
    resource: ['comment'],
};

export const commentDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: showOnlyForComment,
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                action: 'Create comment',
                description: 'Create a new comment',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/comments/modify',
                        body: {
                            request: {},
                        },
                    },
                    output: {
                        postReceive: [
                            {
                                type: 'rootProperty',
                                enabled: true,
                                properties: {
                                    property: 'data',
                                }

                            }
                        ]
                    }
                },
            },
            {
                name: 'Delete',
                value: 'delete',
                action: 'Delete comment',
                description: 'Delete existing comment',
                routing: {
                    request: {
                        method: 'POST',
                        url: '={{"/comments/delete/" + $parameter.commentId}}'
                    }
                }
            },
            {
                name: 'Get Many',
                value: 'getAll',
                action: 'Get comments',
                description: 'Get manycomments',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/comments/list',
                    },
                    output: {
                        postReceive: [
                            {
                                type: 'rootProperty',
                                enabled: '={{ $parameter.splitOutput }}',
                                properties: {
                                    property: 'data',
                                }
                            },
                            {
                                type: 'set',
                                enabled: '={{ !$parameter.splitOutput }}',
                                properties: {
                                    value: '={{ $response.body }}',
                                }
                            }
                        ]
                    }
                },
            },
            {
                name: 'Update',
                value: 'update',
                action: 'Update comment',
                description: 'Update exisiting comment',
                routing: {
                    request: {
                        method: 'POST',
                        url: '={{"/comments/modify/" + $parameter.commentId}}',
                        body: {
                            request: '={{$parameter.request}}',
                        },
                    },
                    output: {
                        postReceive: [
                            {
                                type: 'rootProperty',
                                enabled: true,
                                properties: {
                                    property: 'data',
                                }

                            }
                        ]
                    }
                },
            },
        ],
        default: 'getAll',
    },
    ...commentGetManyDescription,
    ...commentCreateDescription,
    ...commentDeleteDescription,
    ...commentUpdateDescription
];