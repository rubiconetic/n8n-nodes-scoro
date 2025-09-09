import type { INodeProperties } from 'n8n-workflow';
import { taskGetDescription } from './get';
import { taskGetManyDescription } from './getAll';
import { taskCreateDescription } from './create';
import { taskDeleteDescription } from './delete';
import { taskUpdateDescription } from './update';

const showOnlyForTask = {
    resource: ['task'],
};

export const taskDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: showOnlyForTask,
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                action: 'Create task',
                description: 'Create a new task',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/tasks/modify',
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
                action: 'Delete task',
                description: 'Delete existing task',
                routing: {
                    request: {
                        method: 'POST',
                        url: '={{"/tasks/delete/" + $parameter.taskId}}'
                    }
                }
            },
            {
                name: 'Get',
                value: 'get',
                action: 'Get a task',
                description: 'Get a task',
                routing: {
                    request: {
                        method: 'POST',
                        url: '={{"/tasks/view/" + $parameter.taskId}}',
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
                action: 'Get tasks',
                description: 'Get many tasks',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/tasks/list',
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
                action: 'Update task',
                description: 'Update exisiting task',
                routing: {
                    request: {
                        method: 'POST',
                        url: '={{"/tasks/modify/" + $parameter.templateId}}',
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
    ...taskGetDescription,
    ...taskGetManyDescription,
    ...taskCreateDescription,
    ...taskDeleteDescription,
    ...taskUpdateDescription
];