import type { INodeProperties } from 'n8n-workflow';
import { triggerGetDescription } from './get';
import { triggerGetManyDescription } from './getAll';
import { triggerCreateDescription } from './create';
import { triggerDeleteDescription } from './delete';
import { triggerUpdateDescription } from './update';

const showOnlyForTrigger = {
    resource: ['trigger'],
};

export const triggerDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: showOnlyForTrigger,
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                action: 'Create trigger',
                description: 'Create a new trigger',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/triggers/modify',
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
                action: 'Delete trigger',
                description: 'Delete existing Trigger',
                routing: {
                    request: {
                        method: 'POST',
                        url: '={{"/triggers/delete/" + $parameter.triggerId}}'
                    }
                }
            },
            {
                name: 'Get',
                value: 'get',
                action: 'Get a the data of a single trigger',
                description: 'Get a Trigger',
                routing: {
                    request: {
                        method: 'POST',
                        url: '={{"/triggers/view/" + $parameter.triggerId}}',
                    },
                    output: {
                        postReceive: [
                            {
                                type: 'rootProperty',
                                enabled: true,
                                properties: {
                                    property: 'data',
                                },
                                errorMessage: '={{$response.body}}',
                            },
                        ]
                    }
                },
            },
            {
                name: 'Get Many',
                value: 'getAll',
                action: 'Get triggers',
                description: 'Get many Triggers',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/triggers/list',
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
                action: 'Update trigger',
                description: 'Update exisiting Trigger',
                routing: {
                    request: {
                        method: 'POST',
                        url: '={{"/triggers/modify/" + $parameter.templateId}}',
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
    ...triggerGetDescription,
    ...triggerGetManyDescription,
    ...triggerCreateDescription,
    ...triggerDeleteDescription,
    ...triggerUpdateDescription
];