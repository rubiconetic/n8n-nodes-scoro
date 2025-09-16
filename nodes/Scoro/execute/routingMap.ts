import { RequestDetails } from '../types';

export const routingMap: Record<string, Record<string, RequestDetails>> = {
    calendar: {
        create: { method: 'POST', url: '/calendar/modify' },
        delete: { method: 'POST', url: '={{"/calendar/delete/" + $parameter.calendarId}}' },
        get: { method: 'POST', url: '={{"/calendar/view/" + $parameter.calendarId}}' },
        getAll: { method: 'POST', url: '/calendar/list' },
        update: { method: 'POST', url: '={{"/calendar/modify/" + $parameter.calendarId}}' },
    },
    clientProfile: {
        create: { method: 'POST', url: '/clientProfiles/modify' },
        delete: { method: 'POST', url: '={{"/clientProfiles/delete/" + $parameter.clientProfileId}}' },
        get: { method: 'POST', url: '={{"/clientProfiles/view/" + $parameter.clientProfileId}}' },
        getAll: { method: 'POST', url: '/clientProfiles/list' },
        update: { method: 'POST', url: '={{"/clientProfiles/modify/" + $parameter.clientProfileId}}' },
    },
    company: {
        create: { method: 'POST', url: '/companies/modify' },
        delete: { method: 'POST', url: '={{"/companies/delete/" + $parameter.companyId}}' },
        get: { method: 'POST', url: '={{"/companies/view/" + $parameter.companyId}}' },
        getAll: { method: 'POST', url: '/companies/list' },
        update: { method: 'POST', url: '={{"/companies/modify/" + $parameter.companyId}}' },
    },
    invoice: {
        create: { method: 'POST', url: '/invoices/modify' },
        delete: { method: 'POST', url: '={{"/invoices/delete/" + $parameter.invoiceId}}' },
        get: { method: 'POST', url: '={{"/invoices/view/" + $parameter.invoiceId}}' },
        getAll: { method: 'POST', url: '/invoices/list' },
        update: { method: 'POST', url: '={{"/invoices/modify/" + $parameter.invoiceId}}' },
    },
    project: {
        create: { method: 'POST', url: '/projects/modify' },
        delete: { method: 'POST', url: '={{"/projects/delete/" + $parameter.projectId}}' },
        get: { method: 'POST', url: '={{"/projects/view/" + $parameter.projectId}}' },
        getAll: { method: 'POST', url: '/projects/list' },
        update: { method: 'POST', url: '={{"/projects/modify/" + $parameter.projectId}}' },
    },
    role: {
        get: { method: 'POST', url: '={{"/roles/view/" + $parameter.roleId}}' },
        getAll: { method: 'POST', url: '/roles/list' },
    },
    status: {
        getAll: { method: 'POST', url: '/statuses/list' },
    },
    task: {
        create: { method: 'POST', url: '/tasks/modify' },
        delete: { method: 'POST', url: '={{"/tasks/delete/" + $parameter.taskId}}' },
        get: { method: 'POST', url: '={{"/tasks/view/" + $parameter.taskId}}' },
        getAll: { method: 'POST', url: '/tasks/list' },
        update: { method: 'POST', url: '={{"/tasks/modify/" + $parameter.taskId}}' },
    },
    timeEntry: {
        create: { method: 'POST', url: '/timeEntries/modify' },
        delete: { method: 'POST', url: '={{"/timeEntries/delete/" + $parameter.timeEntryId}}' },
        get: { method: 'POST', url: '={{"/timeEntries/view/" + $parameter.timeEntryId}}' },
        getAll: { method: 'POST', url: '/timeEntries/list' },
        setDone: { method: 'POST', url: '={{"/timeEntries/setDone/" + $parameter.timeEntryId}}' },
        update: { method: 'POST', url: '={{"/timeEntries/modify/" + $parameter.timeEntryId}}' },
    },
    trigger: {
        create: { method: 'POST', url: '/triggers/modify' },
        delete: { method: 'POST', url: '={{"/triggers/delete/" + $parameter.triggerId}}' },
        get: { method: 'POST', url: '={{"/triggers/view/" + $parameter.triggerId}}' },
        getAll: { method: 'POST', url: '/triggers/list' },
        update: { method: 'POST', url: '={{"/triggers/modify/" + $parameter.triggerId}}' },
    },
    user: {
        get: { method: 'POST', url: '={{"/users/view/" + $parameter.userId}}' },
        getAll: { method: 'POST', url: '/users/list' },
    },
    comment: {
        create: { method: 'POST', url: '/comments/modify' },
        delete: { method: 'POST', url: '={{"/comments/delete/" + $parameter.commentId}}' },
        getAll: { method: 'POST', url: '/comments/list' },
        update: { method: 'POST', url: '/comments/modify + $parameter.commentId' },
    },
};