import type { INodeProperties } from 'n8n-workflow';
import { requestProperty } from '../../shared/descriptions';

export const showOnlyForClientProfileUpdate = {
    operation: ['update'],
    resource: ['clientProfile'],
};

export const clientProfileUpdateDescription: INodeProperties[] = [
    {
        displayName: 'Client Profile',
        name: 'clientProfileId',
        type: 'resourceLocator',
        displayOptions: { show: showOnlyForClientProfileUpdate },
        default: { mode: 'list', value: '' },
        required: true,
        modes: [
            {
                displayName: 'From List',
                name: 'list',
                type: 'list',
                placeholder: 'Select a clientProfile...',
                typeOptions: {
                    searchListMethod: 'getClientProfiles',
                    searchable: true,
                },
            },
            {
                displayName: 'By ID',
                name: 'id',
                type: 'string',
                placeholder: 'Enter Client Profile ID',
                validation: [
                    {
                        type: 'regex',
                        properties: {
                            regex: '^[0-9]+$',
                            errorMessage: 'ClientProfile ID must be numeric',
                        },
                    },
                ],
            },
        ],
    },
    {
        ...requestProperty,
        displayOptions: {
            show: showOnlyForClientProfileUpdate,
        }
    }
];