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
import { commentHandler } from './actions/comment';
import { contactHandler } from './actions/contact';
import { invoiceHandler } from './actions/invoice';
import { orderHandler } from './actions/order';
import { projectHandler } from './actions/project';
import { purchaseOrderHandler } from './actions/purchaseOrder';
import { quoteHandler } from './actions/quote';
import { taskHandler } from './actions/task';
import { timeEntryHandler } from './actions/timeEntry';
import { apiRequestFields, apiRequestOperations } from './descriptions/ApiRequestDescription';
import { commentFields, commentOperations } from './descriptions/CommentDescription';
import { contactFields, contactOperations } from './descriptions/ContactDescription';
import { invoiceFields, invoiceOperations } from './descriptions/InvoiceDescription';
import { orderFields, orderOperations } from './descriptions/OrderDescription';
import { projectFields, projectOperations } from './descriptions/ProjectDescription';
import {
	purchaseOrderFields,
	purchaseOrderOperations,
} from './descriptions/PurchaseOrderDescription';
import { quoteFields, quoteOperations } from './descriptions/QuoteDescription';
import { taskFields, taskOperations } from './descriptions/TaskDescription';
import { timeEntryFields, timeEntryOperations } from './descriptions/TimeEntryDescription';
import { scoroApiRequest, scoroApiRequestAllItems } from './GenericFunctions';
import { searchContacts, searchProjects, searchTasks, searchUsers } from './listSearch';

// Register one handler per resource. A resource that is missing here fails with a clear error.
const handlers: Record<string, ResourceHandler> = {
	apiRequest: apiRequestHandler,
	comment: commentHandler,
	contact: contactHandler,
	invoice: invoiceHandler,
	order: orderHandler,
	project: projectHandler,
	purchaseOrder: purchaseOrderHandler,
	quote: quoteHandler,
	task: taskHandler,
	timeEntry: timeEntryHandler,
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
			'Manage comments, contacts, invoices, orders, projects, purchase orders, quotes, tasks and time entries in Scoro',
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
						name: 'Comment',
						value: 'comment',
					},
					{
						name: 'Contact',
						value: 'contact',
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
						name: 'Task',
						value: 'task',
					},
					{
						name: 'Time Entry',
						value: 'timeEntry',
					},
				],
				default: 'contact',
			},
			...apiRequestOperations,
			...apiRequestFields,
			...commentOperations,
			...commentFields,
			...contactOperations,
			...contactFields,
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
			...taskOperations,
			...taskFields,
			...timeEntryOperations,
			...timeEntryFields,
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
