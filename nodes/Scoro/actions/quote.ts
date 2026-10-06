import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { scoroApiRequest } from '../GenericFunctions';
import { buildCustomFields, buildLines, compact, dateRange, toId } from '../helpers';
import { buildDocumentRequest, composeFilter, getMany } from './common';

export async function quoteHandler(
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
				? '/quotes/modify'
				: `/quotes/modify/${toId(this.getNodeParameter('quoteId', itemIndex))}`;
		return await scoroApiRequest.call(this, endpoint, { return_data: 1, request });
	}

	if (operation === 'get') {
		const quoteId = toId(this.getNodeParameter('quoteId', itemIndex));
		return await scoroApiRequest.call(this, `/quotes/view/${quoteId}`, { request: {} });
	}

	if (operation === 'delete') {
		const quoteId = toId(this.getNodeParameter('quoteId', itemIndex));
		await scoroApiRequest.call(this, `/quotes/delete/${quoteId}`, { request: {} });
		return { deleted: true, id: quoteId };
	}

	if (operation === 'getPdf') {
		const quoteId = toId(this.getNodeParameter('quoteId', itemIndex));
		const templateId = toId(this.getNodeParameter('templateId', itemIndex, ''));
		const request = compact({ template_id: templateId });
		return await scoroApiRequest.call(this, `/quotes/pdf/${quoteId}`, { request });
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

		return await getMany.call(this, '/quotes/list', filter, itemIndex);
	}

	throw new NodeOperationError(
		this.getNode(),
		`The operation "${operation}" is not supported for quotes`,
		{ itemIndex },
	);
}
