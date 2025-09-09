import type { INodeProperties } from 'n8n-workflow';
import { statusGetManyDescription } from './getAll';

const showOnlyForStatus = {
    resource: ['status'],
};

export const statusDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: showOnlyForStatus,
        },
        options: [
            {
                name: 'Get Many',
                value: 'getAll',
                action: 'Get statuses',
                description: 'Get many statuses',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/statuses/list',
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
        ],
        default: 'getAll',
    },
    ...statusGetManyDescription,
];