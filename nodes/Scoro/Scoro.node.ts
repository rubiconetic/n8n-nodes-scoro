import {
    NodeConnectionType,
    type IDataObject,
    type IExecuteFunctions,
    type INodeExecutionData,
    type INodeType,
    type INodeTypeDescription,
    NodeOperationError,
} from 'n8n-workflow';
import {
    commentDescription,
    triggerDescription,
    timeEntryDescription,
    taskDescription,
    statusDescription,
    roleDescription,
    projectDescription,
    invoiceDescription,
    companyDescription,
    clientProfileDescription,
    calendarDescription,
    userDescription
} from './resources';
import {
    getComments,
    getUsers,
    getTriggers,
    getTimeEntries,
    getTasks,
    getRoles,
    getProjects,
    getInvoices,
    getCompanies,
    getClientProfiles,
    getCalendarEvents
} from './listSearch';

import { routingMap, handleGetAllOperation, handleStandardOperation } from './execute';

export class Scoro implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Scoro',
        name: 'scoro',
        icon: { light: 'file:scoro.svg', dark: 'file:scoro.dark.svg' },
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Interact with the Scoro API',
        defaults: {
            name: 'Scoro',
        },
        usableAsTool: true,
        inputs: [NodeConnectionType.Main],
        outputs: [NodeConnectionType.Main],
        credentials: [{ name: 'scoroApi', required: true }],
        requestDefaults: {
            baseURL: '={{$credentials.baseUrl}}',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        },
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    { name: 'Calendar', value: 'calendar' },
                    { name: 'ClientProfile', value: 'clientProfile' },
                    { name: 'Comment', value: 'comment' },
                    { name: 'Company', value: 'company' },
                    { name: 'Invoice', value: 'invoice' },
                    { name: 'Project', value: 'project' },
                    { name: 'Role', value: 'role' },
                    { name: 'Status', value: 'status' },
                    { name: 'Task', value: 'task' },
                    { name: 'Time Entry', value: 'timeEntry' },
                    { name: 'Trigger', value: 'trigger' },
                    { name: 'User', value: 'user' },
                ],
                default: 'user',
            },
            ...calendarDescription,
            ...clientProfileDescription,
            ...commentDescription,
            ...companyDescription,
            ...invoiceDescription,
            ...projectDescription,
            ...roleDescription,
            ...statusDescription,
            ...taskDescription,
            ...timeEntryDescription,
            ...triggerDescription,
            ...userDescription

        ],
    };

    methods = {
        listSearch: {
            getCalendarEvents,
            getClientProfiles,
            getComments,
            getCompanies,
            getInvoices,
            getProjects,
            getRoles,
            getTasks,
            getTimeEntries,
            getTriggers,
            getUsers,

        },
    };
    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        // 1. Get Core Parameters
        const resource = this.getNodeParameter('resource', 0) as string;
        const operation = this.getNodeParameter('operation', 0) as string;

        // 2. Get Request Details from Routing Map
        const requestDetails = routingMap[resource]?.[operation];
        if (!requestDetails) {
            throw new NodeOperationError(this.getNode(), `Operation '${operation}' for resource '${resource}' is not supported.`);
        }

        // 3. Prepare Credentials and Base Payload
        const credentials = await this.getCredentials('scoroApi');
        const baseURL = credentials.baseUrl as string;
        const baseBody: IDataObject = {
            lang: 'eng',
            company_account_id: credentials.companyAccountId as string,
            apiKey: credentials.apiKey as string,
        };

        // 4. Dispatch to the Correct Handler
        if (operation === 'getAll') {
            return handleGetAllOperation(this, requestDetails, baseBody, baseURL, resource);
        } else {
            return handleStandardOperation(this, requestDetails, baseBody, baseURL, resource, operation);
        }
    }
}