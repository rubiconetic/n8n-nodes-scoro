import type { INodeProperties } from 'n8n-workflow';
import { requestProperty } from '../../shared/descriptions';

const showOnlyForTimeEntryCreate = {
    operation: ['create'],
    resource: ['timeEntry'],
};

export const timeEntryCreateDescription: INodeProperties[] = [
    {
        ...requestProperty,
        displayOptions: {
            show: showOnlyForTimeEntryCreate,
        },
        description: 'The request body for creating a time entry.',

    }
];