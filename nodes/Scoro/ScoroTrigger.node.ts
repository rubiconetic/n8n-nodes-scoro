import type {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import { scoroApiRequest } from './GenericFunctions';
import { splitList, toId } from './helpers';

const VIEW_ENDPOINT_BY_MODULE: Record<string, string> = {
	bills: 'bills',
	calendar: 'calendar',
	companies: 'contacts',
	expenses: 'expenses',
	invoices: 'invoices',
	orders: 'orders',
	persons: 'contacts',
	prepayments: 'prepayments',
	projects: 'projects',
	purchaseOrders: 'purchaseOrders',
	quotes: 'quotes',
	tasks: 'tasks',
};

export class ScoroTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scoro Trigger',
		name: 'scoroTrigger',
		icon: { light: 'file:../../icons/scoro.svg', dark: 'file:../../icons/scoro.dark.svg' },
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["module"] + ": " + $parameter["action"]}}',
		description: 'Starts the workflow when a Scoro event occurs',
		defaults: {
			name: 'Scoro Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'scoroApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'setup',
				httpMethod: 'GET',
				responseMode: 'onReceived',
				path: 'webhook',
			},
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName:
					'Scoro only delivers webhooks to verified domains. Add a DNS TXT record containing "scoro.txt" on the host of your n8n webhook URL, or serve a plain text file at https://your-n8n-host/scoro.txt. See the README for details.',
				name: 'domainNotice',
				type: 'notice',
				default: '',
			},
			{
				displayName: 'Module',
				name: 'module',
				type: 'options',
				required: true,
				noDataExpression: true,
				options: [
					{ name: 'Bill', value: 'bills' },
					{ name: 'Calendar Event', value: 'calendar' },
					{ name: 'Company', value: 'companies' },
					{ name: 'Expense', value: 'expenses' },
					{ name: 'Invoice', value: 'invoices' },
					{ name: 'Order', value: 'orders' },
					{ name: 'Person', value: 'persons' },
					{ name: 'Prepayment', value: 'prepayments' },
					{ name: 'Project', value: 'projects' },
					{ name: 'Purchase Order', value: 'purchaseOrders' },
					{ name: 'Quote', value: 'quotes' },
					{ name: 'Task', value: 'tasks' },
				],
				default: 'projects',
				description: 'The Scoro module to listen to',
			},
			{
				displayName: 'Trigger On',
				name: 'action',
				type: 'options',
				required: true,
				noDataExpression: true,
				options: [
					{ name: 'Any Event', value: 'any' },
					{ name: 'Record Created', value: 'create' },
					{ name: 'Record Deleted', value: 'delete' },
					{ name: 'Record Modified', value: 'modify' },
				],
				default: 'any',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add option',
				default: {},
				options: [
					{
						displayName: 'Acting Users',
						name: 'actors',
						type: 'string',
						default: '',
						placeholder: 'e.g. any',
						description:
							'Comma-separated list limiting which users must perform the change: user IDs, "any", "me", or "group_ID" for a user group',
					},
					{
						displayName: 'Bookmark ID',
						name: 'bookmarkId',
						type: 'string',
						default: '',
						placeholder: 'e.g. 111',
						description:
							'ID of the Scoro bookmark to filter by when Relation Type is set to Bookmark',
					},
					{
						displayName: 'Fetch Full Record',
						name: 'resolveData',
						type: 'boolean',
						default: false,
						description:
							'Whether to fetch the full record from Scoro on create and modify events and attach it under the "record" field',
					},
					{
						displayName: 'Owners',
						name: 'owners',
						type: 'string',
						default: '',
						placeholder: 'e.g. 1,2,group_5',
						description:
							'Comma-separated list limiting whose records are watched: user IDs, "any", "me", or "group_ID" for a user group',
					},
					{
						displayName: 'Relation Type',
						name: 'relationType',
						type: 'options',
						options: [
							{ name: 'Assigned To (Tasks)', value: 'assigned_to' },
							{ name: 'Bookmark', value: 'bookmark' },
							{ name: 'Created By (Calendar, Projects, Tasks)', value: 'created_by' },
							{ name: 'Managed By (Projects)', value: 'managed_by' },
							{ name: 'Owned By (Contacts, Documents)', value: 'owned_by' },
							{ name: 'Participated By (Calendar)', value: 'participated_by' },
							{ name: 'Responsible User (Tasks)', value: 'responsible_user' },
							{ name: 'With Member (Projects)', value: 'with_member' },
						],
						default: 'owned_by',
						description:
							'How the owners relate to the record. Allowed values depend on the module.',
					},
					{
						displayName: 'Watched Fields',
						name: 'fields',
						type: 'string',
						default: '',
						placeholder: 'e.g. status,deadline',
						description:
							'Comma-separated list of fields. When set, modify events only fire if one of these fields changes. Allowed values depend on the module.',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const staticData = this.getWorkflowStaticData('node');
				const moduleName = this.getNodeParameter('module') as string;
				const action = this.getNodeParameter('action') as string;

				const webhooks = await scoroApiRequest.call(this, '/webhooks/list', { request: {} });
				const existing = (Array.isArray(webhooks) ? webhooks : []).find(
					(webhook) =>
						webhook.url === webhookUrl &&
						webhook.module === moduleName &&
						webhook.action === action,
				);

				if (existing) {
					staticData.webhookId = existing.id;
					return true;
				}
				delete staticData.webhookId;
				return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const staticData = this.getWorkflowStaticData('node');
				const options = this.getNodeParameter('options', {}) as IDataObject;

				const request: IDataObject = {
					module: this.getNodeParameter('module') as string,
					action: this.getNodeParameter('action') as string,
					url: webhookUrl,
				};
				if (options.relationType) request.relation_type = options.relationType;
				const bookmarkId = toId(options.bookmarkId);
				if (bookmarkId !== undefined) request.bookmark_id = bookmarkId;
				const owners = splitList(options.owners);
				if (owners.length > 0) request.owners = owners;
				const actors = splitList(options.actors);
				if (actors.length > 0) request.actors = actors;
				const fields = splitList(options.fields);
				if (fields.length > 0) request.fields = fields;

				const webhook = await scoroApiRequest.call(this, '/webhooks/subscribe', { request });
				const webhookId = Array.isArray(webhook) ? undefined : webhook?.id;
				if (webhookId === undefined || webhookId === null) {
					throw new NodeOperationError(
						this.getNode(),
						'Scoro did not return a webhook ID for the subscription',
					);
				}
				staticData.webhookId = webhookId;
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const staticData = this.getWorkflowStaticData('node');
				if (staticData.webhookId === undefined) {
					return true;
				}
				try {
					await scoroApiRequest.call(this, `/webhooks/unsubscribe/${staticData.webhookId}`, {
						request: {},
					});
				} catch (error) {
					this.logger.warn(
						`Scoro Trigger: could not unsubscribe webhook ${staticData.webhookId}: ${(error as Error).message}`,
					);
					return false;
				}
				delete staticData.webhookId;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		// Scoro checks that the URL answers with HTTP 200 before it accepts a subscription.
		if (this.getWebhookName() === 'setup') {
			return { webhookResponse: 'OK' };
		}
		const body = this.getBodyData();
		if (!body || Object.keys(body).length === 0) {
			return { webhookResponse: 'OK' };
		}
		const options = this.getNodeParameter('options', {}) as IDataObject;
		if (options.resolveData) {
			const eventAction = String(
				body.action ?? body.event ?? this.getNodeParameter('action', '') ?? '',
			);
			const entityId = toId(body.entityId ?? body.entity_id ?? body.id);
			const moduleName = String(
				body.module ?? body.entityType ?? this.getNodeParameter('module', '') ?? '',
			);
			const viewModule = VIEW_ENDPOINT_BY_MODULE[moduleName] || moduleName;
			if (entityId !== undefined && viewModule && eventAction !== 'delete') {
				const record = await scoroApiRequest.call(this, `/${viewModule}/view/${entityId}`, {
					request: {},
				});
				return {
					workflowData: [this.helpers.returnJsonArray({ ...body, record })],
				};
			}
		}
		return {
			workflowData: [this.helpers.returnJsonArray(body)],
		};
	}
}
