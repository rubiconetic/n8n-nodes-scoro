import type { INodeProperties } from 'n8n-workflow';
import { getManyOptionsProperty, splitOutputProperty } from '../../shared/descriptions';

const showOnlyForTimeEntryGetMany = {
    operation: ['getAll'],
    resource: ['timeEntry'],
};

export const timeEntryGetManyDescription: INodeProperties[] = [
    {
        ...splitOutputProperty,
        displayOptions: { show: showOnlyForTimeEntryGetMany },
    },
    {
        ...getManyOptionsProperty,
        displayOptions: { show: showOnlyForTimeEntryGetMany },
    }
];