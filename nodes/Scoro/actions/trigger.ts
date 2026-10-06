import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { scoroApiRequest } from '../GenericFunctions';
import { compact, toId } from '../helpers';
import { getMany, toFlag } from './common';

function buildTriggerRequest(fields: IDataObject): IDataObject {
	const req: IDataObject = compact({
		name: fields.name,
		module: fields.module,
		status: fields.status,
		is_shared: fields.isShared !== undefined ? toFlag(fields.isShared) : undefined,
	});

	if (fields.urlToPost) {
		req.actions = [
			{
				type: 'WebHook',
				action_data: {
					urlToPost: fields.urlToPost,
				},
			},
		];
	}

	if (Array.isArray(fields.activities) && fields.activities.length > 0) {
		req.activities = (fields.activities as string[]).map((activity) => ({ activity }));
	}

	return req;
}

export async function triggerHandler(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[] | undefined> {
	if (operation === 'create' || operation === 'update') {
		const fields =
			operation === 'create'
				? {
						...(this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject),
						name: this.getNodeParameter('name', itemIndex) as string,
						module: this.getNodeParameter('module', itemIndex) as string,
						urlToPost: this.getNodeParameter('urlToPost', itemIndex) as string,
						activities: this.getNodeParameter('activities', itemIndex, []) as string[],
					}
				: (this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject);

		const request = buildTriggerRequest(fields);
		const endpoint =
			operation === 'create'
				? '/triggers/modify'
				: `/triggers/modify/${toId(this.getNodeParameter('triggerId', itemIndex))}`;
		return await scoroApiRequest.call(this, endpoint, { return_data: 1, request });
	}

	if (operation === 'get') {
		const triggerId = toId(this.getNodeParameter('triggerId', itemIndex));
		return await scoroApiRequest.call(this, `/triggers/view/${triggerId}`, { request: {} });
	}

	if (operation === 'delete') {
		const triggerId = toId(this.getNodeParameter('triggerId', itemIndex));
		await scoroApiRequest.call(this, `/triggers/delete/${triggerId}`, { request: {} });
		return { deleted: true, id: triggerId };
	}

	if (operation === 'getAll') {
		return await getMany.call(this, '/triggers/list', {}, itemIndex);
	}

	throw new NodeOperationError(
		this.getNode(),
		`The operation "${operation}" is not supported for triggers`,
		{ itemIndex },
	);
}
