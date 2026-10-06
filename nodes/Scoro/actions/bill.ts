import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { scoroApiRequest } from '../GenericFunctions';
import { buildCustomFields, buildLines, compact, dateRange, toDateOnly, toId } from '../helpers';
import { composeFilter, getMany, toFlag } from './common';

function buildBillRequest(fields: IDataObject): IDataObject {
	return compact({
		company_id: toId(fields.companyId),
		person_id: toId(fields.personId),
		project_id: toId(fields.projectId),
		owner_id: toId(fields.ownerId),
		date: toDateOnly(fields.date),
		deadline: toDateOnly(fields.deadline),
		dateofpayment: toDateOnly(fields.dateofpayment),
		currency: fields.currency,
		description: fields.description,
		discount: fields.discount,
		no: fields.no,
		status: fields.status,
		payment_type: fields.paymentType,
		reference_no: fields.referenceNo,
		purchase_order_id: toId(fields.purchaseOrderId),
		is_chargeable: toFlag(fields.isChargeable),
	});
}

export async function billHandler(
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

		const request = buildBillRequest(fields);
		const lines = buildLines(this.getNodeParameter('linesUi', itemIndex, {}));
		if (lines !== undefined) request.lines = lines;

		const customFields = buildCustomFields(this.getNodeParameter('customFieldsUi', itemIndex, {}));
		if (customFields) request.custom_fields = customFields;

		const endpoint =
			operation === 'create'
				? '/bills/modify'
				: `/bills/modify/${toId(this.getNodeParameter('billId', itemIndex))}`;
		return await scoroApiRequest.call(this, endpoint, { return_data: 1, request });
	}

	if (operation === 'get') {
		const billId = toId(this.getNodeParameter('billId', itemIndex));
		return await scoroApiRequest.call(this, `/bills/view/${billId}`, { request: {} });
	}

	if (operation === 'delete') {
		const billId = toId(this.getNodeParameter('billId', itemIndex));
		await scoroApiRequest.call(this, `/bills/delete/${billId}`, { request: {} });
		return { deleted: true, id: billId };
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

		return await getMany.call(this, '/bills/list', filter, itemIndex);
	}

	throw new NodeOperationError(
		this.getNode(),
		`The operation "${operation}" is not supported for bills`,
		{ itemIndex },
	);
}
