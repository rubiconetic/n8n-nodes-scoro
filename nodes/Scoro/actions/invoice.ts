import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { scoroApiRequest } from '../GenericFunctions';
import { buildCustomFields, buildLines, compact, dateRange, toId } from '../helpers';
import { buildDocumentRequest, composeFilter, getMany } from './common';

export async function invoiceHandler(
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
				? '/invoices/modify'
				: `/invoices/modify/${toId(this.getNodeParameter('invoiceId', itemIndex))}`;
		return await scoroApiRequest.call(this, endpoint, { return_data: 1, request });
	}

	if (operation === 'get') {
		const invoiceId = toId(this.getNodeParameter('invoiceId', itemIndex));
		return await scoroApiRequest.call(this, `/invoices/view/${invoiceId}`, { request: {} });
	}

	if (operation === 'delete') {
		const invoiceId = toId(this.getNodeParameter('invoiceId', itemIndex));
		await scoroApiRequest.call(this, `/invoices/delete/${invoiceId}`, { request: {} });
		return { deleted: true, id: invoiceId };
	}

	if (operation === 'getPdf') {
		const invoiceId = toId(this.getNodeParameter('invoiceId', itemIndex));
		const templateId = toId(this.getNodeParameter('templateId', itemIndex, ''));
		const request = compact({ template_id: templateId });
		return await scoroApiRequest.call(this, `/invoices/pdf/${invoiceId}`, { request });
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

		return await getMany.call(this, '/invoices/list', filter, itemIndex);
	}

	throw new NodeOperationError(
		this.getNode(),
		`The operation "${operation}" is not supported for invoices`,
		{ itemIndex },
	);
}
