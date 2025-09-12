import type { INodeProperties } from 'n8n-workflow';
import { getManyOptionsProperty } from '../../shared/descriptions';

const showOnlyForCalendarGetMany = {
    operation: ['getAll'],
    resource: ['calendar'],
};

export const calendarGetManyDescription: INodeProperties[] = [
    {
        ...getManyOptionsProperty,
        displayOptions: { show: showOnlyForCalendarGetMany },
    }
];