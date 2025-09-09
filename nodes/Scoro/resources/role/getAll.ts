import type { INodeProperties } from 'n8n-workflow';
import { getManyOptionsProperty, splitOutputProperty } from '../../shared/descriptions';

const showOnlyForRoleGetMany = {
    operation: ['getAll'],
    resource: ['role'],
};

export const roleGetManyDescription: INodeProperties[] = [
    {
        ...splitOutputProperty,
        displayOptions: { show: showOnlyForRoleGetMany },
    },
    {
        ...getManyOptionsProperty,
        displayOptions: { show: showOnlyForRoleGetMany },
    }
];