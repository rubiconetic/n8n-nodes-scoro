import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { scoroApiRequest } from '../GenericFunctions';
import { toId } from '../helpers';
import { composeFilter, getMany } from './common';

export async function userHandler(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[] | undefined> {
	if (operation === 'get') {
		const userId = toId(this.getNodeParameter('userId', itemIndex));
		return await scoroApiRequest.call(this, `/users/view/${userId}`, { request: {} });
	}

	if (operation === 'getAll') {
		const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;
		const filter = composeFilter(filters, {
			status: filters.status,
		});

		return await getMany.call(this, '/users/list', filter, itemIndex);
	}

	throw new NodeOperationError(
		this.getNode(),
		`The operation "${operation}" is not supported for users`,
		{ itemIndex },
	);
}
