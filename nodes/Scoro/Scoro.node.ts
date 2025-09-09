import { NodeConnectionType, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { calendarDescription, clientProfileDescription, companyDescription, invoiceDescription, projectDescription, roleDescription, statusDescription, taskDescription, timeEntryDescription, triggerDescription, userDescription } from './resources';
import { getCalendarEvents, getClientProfiles, getCompanies, getInvoices, getProjects, getRoles, getTasks, getTimeEntries, getTriggers, getUsers } from './listSearch';
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
					{
						name: 'Calendar',
						value: 'calendar',
					},
					{
						name: 'ClientProfile',
						value: 'clientProfile',
					},
					{
						name: 'Company',
						value: 'company',
					},
					{
						name: 'Invoice',
						value: 'invoice',
					},
					{
						name: 'Project',
						value: 'project',
					},
					{
						name: 'Role',
						value: 'role',
					},
					{
						name: 'Status',
						value: 'status',
					},
					{
						name: 'Task',
						value: 'task',
					},
					{
						name: 'Time Entry',
						value: 'timeEntry',
					},
					{
						name: 'Trigger',
						value: 'trigger',
					},
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'user',
			},
			...calendarDescription,
			...clientProfileDescription,
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
			getCompanies,
			getInvoices,
			getProjects,
			getRoles,
			getTasks,
			getTimeEntries,
			getTriggers,
			getUsers,
		
		
		
		}
	}
}

