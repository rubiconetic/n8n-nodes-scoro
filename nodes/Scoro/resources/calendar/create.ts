import type { INodeProperties } from 'n8n-workflow';
import { requestProperty } from '../../shared/descriptions';

const showOnlyForCalendarCreate = {
    operation: ['create'],
    resource: ['calendar'],
};

export const calendarCreateDescription: INodeProperties[] = [
    {
        ...requestProperty,
        displayOptions: {
            show: showOnlyForCalendarCreate,
        }
    }
];