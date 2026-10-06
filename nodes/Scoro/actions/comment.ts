import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { scoroApiRequest } from '../GenericFunctions';
import { compact, dateRange, toId } from '../helpers';
import { getMany } from './common';

export async function commentHandler(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[] | undefined> {
	if (operation === 'create') {
		const module = this.getNodeParameter('module', itemIndex) as string;
		const objectId = this.getNodeParameter('objectId', itemIndex);
		const comment = this.getNodeParameter('comment', itemIndex) as string;
		const additionalFields = this.getNodeParameter(
			'additionalFields',
			itemIndex,
			{},
		) as IDataObject;

		const request = compact({
			module,
			object_id: toId(objectId),
			comment,
			user_id: toId(additionalFields.userId),
		});

		return await scoroApiRequest.call(this, '/comments/modify', {
			return_data: 1,
			request,
		});
	}

	if (operation === 'update') {
		const commentId = toId(this.getNodeParameter('commentId', itemIndex));
		const comment = this.getNodeParameter('comment', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const request = compact({
			comment,
			user_id: toId(updateFields.userId),
		});

		return await scoroApiRequest.call(this, `/comments/modify/${commentId}`, {
			return_data: 1,
			request,
		});
	}

	if (operation === 'delete') {
		const commentId = toId(this.getNodeParameter('commentId', itemIndex));
		await scoroApiRequest.call(this, `/comments/delete/${commentId}`, { request: {} });
		return { deleted: true, id: commentId };
	}

	if (operation === 'getAll') {
		const module = this.getNodeParameter('module', itemIndex) as string;
		const objectId = this.getNodeParameter('objectId', itemIndex);
		const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;

		const filter = compact({
			module,
			object_id: toId(objectId),
			user_id: toId(filters.userId),
			modified_date: dateRange(filters.modifiedFrom, filters.modifiedTo),
		});

		const extraBody: IDataObject = {
			request: compact({
				module,
				object_id: toId(objectId),
			}),
		};

		return await getMany.call(this, '/comments/list', filter, itemIndex, extraBody);
	}

	throw new NodeOperationError(
		this.getNode(),
		`The operation "${operation}" is not supported for comments`,
		{ itemIndex },
	);
}
