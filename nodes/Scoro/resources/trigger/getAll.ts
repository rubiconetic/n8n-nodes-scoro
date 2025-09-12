import type { INodeProperties } from 'n8n-workflow';
import { getManyOptionsProperty } from '../../shared/descriptions';

const showOnlyForTriggerGetMany = {
    operation: ['getAll'],
    resource: ['trigger'],
};

export const triggerGetManyDescription: INodeProperties[] = [
    {
        ...getManyOptionsProperty,
        displayOptions: { show: showOnlyForTriggerGetMany },
    }
];