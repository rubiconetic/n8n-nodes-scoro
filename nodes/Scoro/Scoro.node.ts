import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import type { ResourceHandler } from './actions/common';
import { apiRequestHandler } from './actions/apiRequest';
import { billHandler } from './actions/bill';
import { calendarEventHandler } from './actions/calendarEvent';
import { clientProfileHandler } from './actions/clientProfile';
import { commentHandler } from './actions/comment';
import { contactHandler } from './actions/contact';
import { expenseHandler } from './actions/expense';
import { invoiceHandler } from './actions/invoice';
import { orderHandler } from './actions/order';
import { projectHandler } from './actions/project';
import { purchaseOrderHandler } from './actions/purchaseOrder';
import { quoteHandler } from './actions/quote';
import { roleHandler } from './actions/role';
import { statusHandler } from './actions/status';
import { taskHandler } from './actions/task';
import { timeEntryHandler } from './actions/timeEntry';
import { triggerHandler } from './actions/trigger';
import { userHandler } from './actions/user';
import { apiRequestFields, apiRequestOperations } from './descriptions/ApiRequestDescription';
import { billFields, billOperations } from './descriptions/BillDescription';
import {
	calendarEventFields,
	calendarEventOperations,
} from './descriptions/CalendarEventDescription';
import {
	clientProfileFields,
	clientProfileOperations,
} from './descriptions/ClientProfileDescription';
import { commentFields, commentOperations } from './descriptions/CommentDescription';
import { contactFields, contactOperations } from './descriptions/ContactDescription';
import { expenseFields, expenseOperations } from './descriptions/ExpenseDescription';
import { invoiceFields, invoiceOperations } from './descriptions/InvoiceDescription';
import { orderFields, orderOperations } from './descriptions/OrderDescription';
import { projectFields, projectOperations } from './descriptions/ProjectDescription';
import {
	purchaseOrderFields,
	purchaseOrderOperations,
} from './descriptions/PurchaseOrderDescription';
import { quoteFields, quoteOperations } from './descriptions/QuoteDescription';
import { roleFields, roleOperations } from './descriptions/RoleDescription';
import { statusFields, statusOperations } from './descriptions/StatusDescription';
import { taskFields, taskOperations } from './descriptions/TaskDescription';
import { timeEntryFields, timeEntryOperations } from './descriptions/TimeEntryDescription';
import { triggerFields, triggerOperations } from './descriptions/TriggerDescription';
import { userFields, userOperations } from './descriptions/UserDescription';
import { scoroApiRequest, scoroApiRequestAllItems } from './GenericFunctions';
import { searchContacts, searchProjects, searchTasks, searchUsers } from './listSearch';

// Register one handler per resource. A resource that is missing here fails with a clear error.
const handlers: Record<string, ResourceHandler> = {
	apiRequest: apiRequestHandler,
	bill: billHandler,
	calendarEvent: calendarEventHandler,
	clientProfile: clientProfileHandler,
	comment: commentHandler,
	contact: contactHandler,
	expense: expenseHandler,
	invoice: invoiceHandler,
	order: orderHandler,
	project: projectHandler,
	purchaseOrder: purchaseOrderHandler,
	quote: quoteHandler,
	role: roleHandler,
	status: statusHandler,
	task: taskHandler,
	timeEntry: timeEntryHandler,
	trigger: triggerHandler,
	user: userHandler,
};

async function loadStatuses(
	context: ILoadOptionsFunctions,
	moduleName: string,
): Promise<INodePropertyOptions[]> {
	const statuses = await scoroApiRequest.call(context, '/statuses/list', {
		filter: { module: [moduleName] },
	});
	const options = (Array.isArray(statuses) ? statuses : []).map((status) => ({
		name: String(status.status_name ?? status.status_id),
		value: String(status.status_id),
	}));
	if (options.length === 0 && moduleName === 'tasks') {
		return [
			{ name: 'Task Status 1', value: 'task_status1' },
			{ name: 'Task Status 2', value: 'task_status2' },
			{ name: 'Task Status 3', value: 'task_status3' },
			{ name: 'Task Status 4', value: 'task_status4' },
		];
	}
	return options;
}

export class Scoro implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scoro',
		name: 'scoro',
		icon: { light: 'file:../../icons/scoro.svg', dark: 'file:../../icons/scoro.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Manage bills, calendar events, client profiles, comments, contacts, expenses, invoices, orders, projects, purchase orders, quotes, roles, statuses, tasks, time entries, triggers, and users in Scoro',
		defaults: {
			name: 'Scoro',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'scoroApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'API Request',
						value: 'apiRequest',
					},
					{
						name: 'Bill',
						value: 'bill',
					},
					{
						name: 'Calendar Event',
						value: 'calendarEvent',
					},
					{
						name: 'Client Profile',
						value: 'clientProfile',
					},
					{
						name: 'Comment',
						value: 'comment',
					},
					{
						name: 'Contact',
						value: 'contact',
					},
					{
						name: 'Expense',
						value: 'expense',
					},
					{
						name: 'Invoice',
						value: 'invoice',
					},
					{
						name: 'Order',
						value: 'order',
					},
					{
						name: 'Project',
						value: 'project',
					},
					{
						name: 'Purchase Order',
						value: 'purchaseOrder',
					},
					{
						name: 'Quote',
						value: 'quote',
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
				default: 'contact',
			},
			...apiRequestOperations,
			...apiRequestFields,
			...billOperations,
			...billFields,
			...calendarEventOperations,
			...calendarEventFields,
			...clientProfileOperations,
			...clientProfileFields,
			...commentOperations,
			...commentFields,
			...contactOperations,
			...contactFields,
			...expenseOperations,
			...expenseFields,
			...invoiceOperations,
			...invoiceFields,
			...orderOperations,
			...orderFields,
			...projectOperations,
			...projectFields,
			...purchaseOrderOperations,
			...purchaseOrderFields,
			...quoteOperations,
			...quoteFields,
			...roleOperations,
			...roleFields,
			...statusOperations,
			...statusFields,
			...taskOperations,
			...taskFields,
			...timeEntryOperations,
			...timeEntryFields,
			...triggerOperations,
			...triggerFields,
			...userOperations,
			...userFields,
		],
	};

	methods = {
		listSearch: {
			searchContacts,
			searchProjects,
			searchTasks,
			searchUsers,
		},
		loadOptions: {
			async getUsers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const users = await scoroApiRequestAllItems.call(this, '/users/list', {});
				return users.map((user) => ({
					name: String(
						user.full_name ||
							`${user.firstname ?? ''} ${user.lastname ?? ''}`.trim() ||
							user.email ||
							`User ${user.id}`,
					),
					value: user.id as number,
				}));
			},
			async getProjectStatuses(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				return await loadStatuses(this, 'projects');
			},
			async getTaskStatuses(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				return await loadStatuses(this, 'tasks');
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const handler = handlers[resource];
		if (!handler) {
			throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
		}

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const responseData = await handler.call(this, operation, itemIndex);
				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData ?? {}),
					{ itemData: { item: itemIndex } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: itemIndex },
					});
					continue;
				}
				const nodeError =
					error instanceof NodeApiError || error instanceof NodeOperationError
						? error
						: new NodeOperationError(this.getNode(), error as Error);
				nodeError.context = { ...nodeError.context, itemIndex };
				throw nodeError;
			}
		}

		return [returnData];
	}
}
