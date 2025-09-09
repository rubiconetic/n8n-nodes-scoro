import type { INodeProperties } from 'n8n-workflow';
import { calendarGetDescription } from './get';
import { calendarGetManyDescription } from './getAll';
import { calendarCreateDescription } from './create';
import { calendarDeleteDescription } from './delete';
import { calendarUpdateDescription } from './update';

const showOnlyForCalendar = {
    resource: ['calendar'],
};

export const calendarDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: showOnlyForCalendar,
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                action: 'Create calendar',
                description: 'Create a new calendar event',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/calendar/modify',
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
                action: 'Delete calendar',
                description: 'Delete existing calendar event',
                routing: {
                    request: {
                        method: 'POST',
                        url: '={{"/calendar/delete/" + $parameter.calendarId}}'
                    }
                }
            },
            {
                name: 'Get',
                value: 'get',
                action: 'Get a calendar event',
                description: 'Get a calendar event',
                routing: {
                    request: {
                        method: 'POST',
                        url: '={{"/calendar/view/" + $parameter.calendarId}}',
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
                action: 'Get calendar',
                description: 'Get many calendar events',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/calendar/list',
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
                action: 'Update calendar',
                description: 'Update exisiting calendar event',
                routing: {
                    request: {
                        method: 'POST',
                        url: '={{"/calendar/modify/" + $parameter.templateId}}',
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
    ...calendarGetDescription,
    ...calendarGetManyDescription,
    ...calendarCreateDescription,
    ...calendarDeleteDescription,
    ...calendarUpdateDescription
];