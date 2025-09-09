import type { INodeProperties } from 'n8n-workflow';
import { clientProfileGetDescription } from './get';
import { clientProfileGetManyDescription } from './getAll';
import { clientProfileCreateDescription } from './create';
import { clientProfileDeleteDescription } from './delete';
import { clientProfileUpdateDescription } from './update';

const showOnlyForClientProfile = {
    resource: ['clientProfile'],
};

export const clientProfileDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: showOnlyForClientProfile,
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                action: 'Create client profile',
                description: 'Create a new client profile',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/clientProfiles/modify',
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
                action: 'Delete client profile',
                description: 'Delete existing client profile',
                routing: {
                    request: {
                        method: 'POST',
                        url: '={{"/clientProfiles/delete/" + $parameter.clientProfileId}}'
                    }
                }
            },
            {
                name: 'Get',
                value: 'get',
                action: 'Get a the data of a single client profile',
                description: 'Get a clientProfile',
                routing: {
                    request: {
                        method: 'POST',
                        url: '={{"/clientProfiles/view/" + $parameter.clientProfileId}}',
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
                action: 'Get client profiles',
                description: 'Get many clientProfiles',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/clientProfiles/list',
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
                action: 'Update client profile',
                description: 'Update exisiting clientProfile',
                routing: {
                    request: {
                        method: 'POST',
                        url: '={{"/clientProfiles/modify/" + $parameter.templateId}}',
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
    ...clientProfileGetDescription,
    ...clientProfileGetManyDescription,
    ...clientProfileCreateDescription,
    ...clientProfileDeleteDescription,
    ...clientProfileUpdateDescription
];