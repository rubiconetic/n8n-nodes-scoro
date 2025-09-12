import type { INodeProperties } from 'n8n-workflow';
import { getManyOptionsProperty } from '../../shared/descriptions';

const showOnlyForTimeEntryGetMany = {
    operation: ['getAll'],
    resource: ['timeEntry'],
};

export const timeEntryGetManyDescription: INodeProperties[] = [
    {
        ...getManyOptionsProperty,
        displayOptions: { show: showOnlyForTimeEntryGetMany },
    }
];