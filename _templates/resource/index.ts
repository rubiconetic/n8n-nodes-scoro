import type { INodeProperties } from 'n8n-workflow';
import { __resource_singular__GetDescription } from './get';
import { __resource_singular__GetManyDescription } from './getAll';
import { __resource_singular__CreateDescription } from './create';
import { __resource_singular__DeleteDescription } from './delete';
import { __resource_singular__UpdateDescription } from './update';

const showOnlyFor__Resource_PascalCase__ = {
    resource: ['__resource_singular__'],
};

export const __resource_singular__Description: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: showOnlyFor__Resource_PascalCase__,
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                action: 'Create __Resource_Lowercase__',
                description: 'Create a new __Resource_Lowercase__',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/__resource_plural__/modify',
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
                action: 'Delete __Resource_Lowercase__',
                description: 'Delete existing __Resource_Lowercase__',
                routing: {
                    request: {
                        method: 'POST',
                        url: '={{"/__resource_plural__/delete/" + $parameter.__resource_singular__Id}}'
                    }
                }
            },
            {
                name: 'Get',
                value: 'get',
                action: 'Get a the data of a single __Resource_Lowercase__',
                description: 'Get a __Resource_Lowercase__',
                routing: {
                    request: {
                        method: 'POST',
                        url: '={{"/__resource_plural__/view/" + $parameter.__resource_singular__Id}}',
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
                action: 'Get __Resource_Lowercase_Plural__',
                description: 'Get many__Resource_Lowercase_Plural__',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/__resource_plural__/list',
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
                action: 'Update __Resource_Lowercase__',
                description: 'Update exisiting __Resource_Lowercase__',
                routing: {
                    request: {
                        method: 'POST',
                        url: '={{"/__resource_plural__/modify/" + $parameter.templateId}}',
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
    ...__resource_singular__GetDescription,
    ...__resource_singular__GetManyDescription,
    ...__resource_singular__CreateDescription,
    ...__resource_singular__DeleteDescription,
    ...__resource_singular__UpdateDescription
];