import type { INodeProperties } from 'n8n-workflow';
import { getManyOptionsProperty } from '../../shared/descriptions';

const showOnlyForRoleGetMany = {
    operation: ['getAll'],
    resource: ['role'],
};

export const roleGetManyDescription: INodeProperties[] = [
    {
        ...getManyOptionsProperty,
        displayOptions: { show: showOnlyForRoleGetMany },
    }
];