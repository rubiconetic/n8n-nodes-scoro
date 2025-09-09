import type { INodeProperties } from 'n8n-workflow';
import { getManyOptionsProperty, splitOutputProperty } from '../../shared/descriptions';

const showOnlyForTriggerGetMany = {
    operation: ['getAll'],
    resource: ['trigger'],
};

export const triggerGetManyDescription: INodeProperties[] = [
    {
        ...splitOutputProperty,
        displayOptions: { show: showOnlyForTriggerGetMany },
    },
    {
        ...getManyOptionsProperty,
        displayOptions: { show: showOnlyForTriggerGetMany },
    }
];