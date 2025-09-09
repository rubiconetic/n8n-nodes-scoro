import type { INodeProperties } from 'n8n-workflow';
import { timeEntryGetDescription } from './get';
import { timeEntryGetManyDescription } from './getAll';
import { timeEntryCreateDescription } from './create';
import { timeEntryDeleteDescription } from './delete';
import { timeEntryUpdateDescription } from './update';
import { timeEntrySetDoneDescription } from './setDone';

const showOnlyForTimeEntry = {
    resource: ['timeEntry'],
};

export const timeEntryDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: showOnlyForTimeEntry,
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                action: 'Create time entry',
                description: 'Create a new time entry',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/timeEntries/modify',
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
                action: 'Delete time entry',
                description: 'Delete existing time entry',
                routing: {
                    request: {
                        method: 'POST',
                        url: '={{"/timeEntries/delete/" + $parameter.timeEntryId}}'
                    }
                }
            },
            {
                name: 'Get',
                value: 'get',
                action: 'Get a time entry',
                description: 'Get a time entry',
                routing: {
                    request: {
                        method: 'POST',
                        url: '={{"/timeEntries/view/" + $parameter.timeEntryId}}',
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
                action: 'Get time entries',
                description: 'Get many time entries',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/timeEntries/list',
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
                name: 'Set Done',
                value: 'setDone',
                action: 'Set done for time entry',
                description: 'Set done for exisiting time entry',
                routing: {
                    request: {
                        method: 'POST',
                        url: '={{"/timeEntries/setDone/" + $parameter.timeEntryId}}',
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
                }
            },
            {
                name: 'Update',
                value: 'update',
                action: 'Update time entry',
                description: 'Update exisiting time entry',
                routing: {
                    request: {
                        method: 'POST',
                        url: '={{"/timeEntries/modify/" + $parameter.templateId}}',
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
    ...timeEntryGetDescription,
    ...timeEntryGetManyDescription,
    ...timeEntryCreateDescription,
    ...timeEntryDeleteDescription,
    ...timeEntryUpdateDescription,
    ...timeEntrySetDoneDescription
];