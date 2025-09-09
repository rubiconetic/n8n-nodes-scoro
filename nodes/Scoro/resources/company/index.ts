import type { INodeProperties } from 'n8n-workflow';
import { companyGetDescription } from './get';
import { companyGetManyDescription } from './getAll';
import { companyCreateDescription } from './create';
import { companyDeleteDescription } from './delete';
import { companyUpdateDescription } from './update';

const showOnlyForCompany = {
    resource: ['company'],
};

export const companyDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: showOnlyForCompany,
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                action: 'Create company',
                description: 'Create a new company',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/companies/modify',
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
                action: 'Delete company',
                description: 'Delete existing company',
                routing: {
                    request: {
                        method: 'POST',
                        url: '={{"/companies/delete/" + $parameter.companyId}}'
                    }
                }
            },
            {
                name: 'Get',
                value: 'get',
                action: 'Get a the data of a single company',
                description: 'Get a company',
                routing: {
                    request: {
                        method: 'POST',
                        url: '={{"/companies/view/" + $parameter.companyId}}',
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
                action: 'Get companies',
                description: 'Get many companies',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/companies/list',
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
                action: 'Update company',
                description: 'Update exisiting company',
                routing: {
                    request: {
                        method: 'POST',
                        url: '={{"/companies/modify/" + $parameter.templateId}}',
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
    ...companyGetDescription,
    ...companyGetManyDescription,
    ...companyCreateDescription,
    ...companyDeleteDescription,
    ...companyUpdateDescription
];