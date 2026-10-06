import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { scoroApiRequest } from '../GenericFunctions';
import { buildCustomFields, buildLines, compact, dateRange, toId } from '../helpers';
import { buildDocumentRequest, getMany } from './common';

export async function purchaseOrderHandler(
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
				? '/purchaseOrders/modify'
				: `/purchaseOrders/modify/${toId(this.getNodeParameter('purchaseOrderId', itemIndex))}`;
		return await scoroApiRequest.call(this, endpoint, { return_data: 1, request });
	}

	if (operation === 'get') {
		const purchaseOrderId = toId(this.getNodeParameter('purchaseOrderId', itemIndex));
		return await scoroApiRequest.call(this, `/purchaseOrders/view/${purchaseOrderId}`, {
			request: {},
		});
	}

	if (operation === 'delete') {
		const purchaseOrderId = toId(this.getNodeParameter('purchaseOrderId', itemIndex));
		await scoroApiRequest.call(this, `/purchaseOrders/delete/${purchaseOrderId}`, { request: {} });
		return { deleted: true, id: purchaseOrderId };
	}

	if (operation === 'getPdf') {
		const purchaseOrderId = toId(this.getNodeParameter('purchaseOrderId', itemIndex));
		const templateId = toId(this.getNodeParameter('templateId', itemIndex, ''));
		const request = compact({ template_id: templateId });
		return await scoroApiRequest.call(this, `/purchaseOrders/pdf/${purchaseOrderId}`, { request });
	}

	if (operation === 'getAll') {
		const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;
		const filter = compact({
			company_id: toId(filters.companyId),
			project_id: toId(filters.projectId),
			status: filters.status,
			date: dateRange(filters.dateFrom, filters.dateTo),
			modified_date: dateRange(filters.modifiedFrom, filters.modifiedTo),
		});

		return await getMany.call(this, '/purchaseOrders/list', filter, itemIndex);
	}

	throw new NodeOperationError(
		this.getNode(),
		`The operation "${operation}" is not supported for purchase orders`,
		{ itemIndex },
	);
}
