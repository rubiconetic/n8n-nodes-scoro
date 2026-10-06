import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { scoroApiRequest } from '../GenericFunctions';
import { compact, toId } from '../helpers';
import { getMany } from './common';

function buildClientProfileRequest(fields: IDataObject): IDataObject {
	return compact({
		name: fields.name,
		currency: fields.currency,
		deadline_days: fields.deadlineDays,
		discount: fields.discount,
		discount2: fields.discount2,
		discount3: fields.discount3,
		fine: fields.fine,
		language_id: fields.languageId,
		payment_type: fields.paymentType,
		price_list_id: toId(fields.priceListId),
		vat_code_id: toId(fields.vatCodeId),
	});
}

export async function clientProfileHandler(
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
					}
				: (this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject);

		const request = buildClientProfileRequest(fields);
		const endpoint =
			operation === 'create'
				? '/clientProfiles/modify'
				: `/clientProfiles/modify/${toId(this.getNodeParameter('clientProfileId', itemIndex))}`;
		return await scoroApiRequest.call(this, endpoint, { return_data: 1, request });
	}

	if (operation === 'get') {
		const clientProfileId = toId(this.getNodeParameter('clientProfileId', itemIndex));
		return await scoroApiRequest.call(this, `/clientProfiles/view/${clientProfileId}`, {
			request: {},
		});
	}

	if (operation === 'delete') {
		const clientProfileId = toId(this.getNodeParameter('clientProfileId', itemIndex));
		await scoroApiRequest.call(this, `/clientProfiles/delete/${clientProfileId}`, { request: {} });
		return { deleted: true, id: clientProfileId };
	}

	if (operation === 'getAll') {
		return await getMany.call(this, '/clientProfiles/list', {}, itemIndex);
	}

	throw new NodeOperationError(
		this.getNode(),
		`The operation "${operation}" is not supported for client profiles`,
		{ itemIndex },
	);
}
