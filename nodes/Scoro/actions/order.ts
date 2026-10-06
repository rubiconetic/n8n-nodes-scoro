import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { scoroApiRequest } from '../GenericFunctions';
import { buildCustomFields, buildLines, compact, dateRange, toId } from '../helpers';
import { buildDocumentRequest, composeFilter, getMany } from './common';

export async function orderHandler(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[] | undefined> {
	if (operation === 'create' || operation === 'update') {
		const fields =
			operation === 'create'
				? {
						...(this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject),
						companyId: this.getNodeParameter('companyId', itemIndex),
					}
				: (this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject);

		const request = buildDocumentRequest(fields);
		const lines = buildLines(this.getNodeParameter('linesUi', itemIndex, {}));
		if (lines !== undefined) request.lines = lines;

		const customFields = buildCustomFields(this.getNodeParameter('customFieldsUi', itemIndex, {}));
		if (customFields) request.custom_fields = customFields;

		const endpoint =
			operation === 'create'
				? '/orders/modify'
				: `/orders/modify/${toId(this.getNodeParameter('orderId', itemIndex))}`;
		return await scoroApiRequest.call(this, endpoint, { return_data: 1, request });
	}

	if (operation === 'get') {
		const orderId = toId(this.getNodeParameter('orderId', itemIndex));
		return await scoroApiRequest.call(this, `/orders/view/${orderId}`, { request: {} });
	}

	if (operation === 'delete') {
		const orderId = toId(this.getNodeParameter('orderId', itemIndex));
		await scoroApiRequest.call(this, `/orders/delete/${orderId}`, { request: {} });
		return { deleted: true, id: orderId };
	}

	if (operation === 'getPdf') {
		const orderId = toId(this.getNodeParameter('orderId', itemIndex));
		const templateId = toId(this.getNodeParameter('templateId', itemIndex, ''));
		const request = compact({ template_id: templateId });
		return await scoroApiRequest.call(this, `/orders/pdf/${orderId}`, { request });
	}

	if (operation === 'getAll') {
		const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;
		const filter = composeFilter(filters, {
			company_id: toId(filters.companyId),
			project_id: toId(filters.projectId),
			status: filters.status,
			date: dateRange(filters.dateFrom, filters.dateTo),
			modified_date: dateRange(filters.modifiedFrom, filters.modifiedTo),
		});

		return await getMany.call(this, '/orders/list', filter, itemIndex);
	}

	throw new NodeOperationError(
		this.getNode(),
		`The operation "${operation}" is not supported for orders`,
		{ itemIndex },
	);
}
