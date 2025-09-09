import type { INodeProperties } from 'n8n-workflow';
import { roleGetDescription } from './get';
import { roleGetManyDescription } from './getAll';

const showOnlyForRole = {
    resource: ['role'],
};

export const roleDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: showOnlyForRole,
        },
        options: [
            {
                name: 'Get',
                value: 'get',
                action: 'Get a role',
                description: 'Get a role',
                routing: {
                    request: {
                        method: 'POST',
                        url: '={{"/roles/view/" + $parameter.roleId}}',
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
                name: 'Get Many',
                value: 'getAll',
                action: 'Get roles',
                description: 'Get many roles',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/roles/list',
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
    ...roleGetDescription,
    ...roleGetManyDescription,
];