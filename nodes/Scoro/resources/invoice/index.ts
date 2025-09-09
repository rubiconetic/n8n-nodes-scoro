import type { INodeProperties } from 'n8n-workflow';
import { invoiceGetDescription } from './get';
import { invoiceGetManyDescription } from './getAll';
import { invoiceCreateDescription } from './create';
import { invoiceDeleteDescription } from './delete';
import { invoiceUpdateDescription } from './update';

const showOnlyForInvoice = {
    resource: ['invoice'],
};

export const invoiceDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: showOnlyForInvoice,
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                action: 'Create invoice',
                description: 'Create a new invoice',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/invoices/modify',
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
                action: 'Delete invoice',
                description: 'Delete existing invoice',
                routing: {
                    request: {
                        method: 'POST',
                        url: '={{"/invoices/delete/" + $parameter.invoiceId}}'
                    }
                }
            },
            {
                name: 'Get',
                value: 'get',
                action: 'Get an invoice',
                description: 'Get an invoice',
                routing: {
                    request: {
                        method: 'POST',
                        url: '={{"/invoices/view/" + $parameter.invoiceId}}',
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
                action: 'Get invoices',
                description: 'Get many invoices',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/invoices/list',
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
                action: 'Update invoice',
                description: 'Update exisiting invoice',
                routing: {
                    request: {
                        method: 'POST',
                        url: '={{"/invoices/modify/" + $parameter.templateId}}',
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
    ...invoiceGetDescription,
    ...invoiceGetManyDescription,
    ...invoiceCreateDescription,
    ...invoiceDeleteDescription,
    ...invoiceUpdateDescription
];