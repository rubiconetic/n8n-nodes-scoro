import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { scoroApiRequest } from '../GenericFunctions';
import { toId } from '../helpers';
import { getMany } from './common';

export async function roleHandler(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[] | undefined> {
	if (operation === 'get') {
		const roleId = toId(this.getNodeParameter('roleId', itemIndex));
		return await scoroApiRequest.call(this, `/roles/view/${roleId}`, { request: {} });
	}

	if (operation === 'getAll') {
		return await getMany.call(this, '/roles/list', {}, itemIndex);
	}

	throw new NodeOperationError(
		this.getNode(),
		`The operation "${operation}" is not supported for roles`,
		{ itemIndex },
	);
}
