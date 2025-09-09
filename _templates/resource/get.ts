import type { INodeProperties } from 'n8n-workflow';

const showOnlyFor__Resource_PascalCase__Get = {
    operation: ['get'],
    resource: ['__resource_singular__'],
};

export const __resource_singular__GetDescription: INodeProperties[] = [
    {
        displayName: '__Resource_Capital_Case__',
        name: '__resource_singular__Id',
        type: 'resourceLocator',
        displayOptions: { show: showOnlyFor__Resource_PascalCase__Get },
        default: { mode: 'list', value: '' },
        required: true,
        modes: [
            {
                displayName: 'From List',
                name: 'list',
                type: 'list',
                typeOptions: {
                    searchListMethod: 'get__Resource_PascalCase_Plural__',
                    searchable: true,
                },
            },
            {
                displayName: 'By ID',
                name: 'id',
                type: 'string',
                placeholder: 'Enter __Resource_Sentence_Case__ ID',
                validation: [
                    {
                        type: 'regex',
                        properties: {
                            regex: '^[0-9]+$', // Ensure it's a number
                            errorMessage: '__Resource_Sentence_Case__ ID must be numeric',
                        },
                    },
                ],
            },
        ],
    },
];