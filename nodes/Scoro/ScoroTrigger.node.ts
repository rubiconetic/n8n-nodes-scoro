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
import { splitList } from './helpers';

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
				displayName: 'Event',
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
				description: 'The event that starts the workflow',
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
						type: 'string',
						default: '',
						placeholder: 'e.g. assigned_to',
						description:
							'How the owners relate to the record, for example created_by, assigned_to, managed_by or owned_by. Allowed values depend on the module.',
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
		return {
			workflowData: [this.helpers.returnJsonArray(body)],
		};
	}
}
