import type { INodeProperties } from 'n8n-workflow';
import { getManyOptionsProperty } from '../../shared/descriptions';

const showOnlyForCalendarGetMany = {
    operation: ['getAll'],
    resource: ['calendar'],
};

export const calendarGetManyDescription: INodeProperties[] = [
    // {
    //     ...splitOutputProperty,
    //     displayOptions: { show: showOnlyForCalendarGetMany },
    // },
    {
        ...getManyOptionsProperty,
        displayOptions: { show: showOnlyForCalendarGetMany },
    }
];