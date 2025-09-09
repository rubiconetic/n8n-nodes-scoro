import type { INodeProperties } from 'n8n-workflow';
import { getManyOptionsProperty } from '../../shared/descriptions';

const showOnlyForTriggerGetMany = {
    operation: ['getAll'],
    resource: ['trigger'],
};

export const triggerGetManyDescription: INodeProperties[] = [
    // {
    //     ...splitOutputProperty,
    //     displayOptions: { show: showOnlyForTriggerGetMany },
    // },
    {
        ...getManyOptionsProperty,
        displayOptions: { show: showOnlyForTriggerGetMany },
    }
];