import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { scoroApiRequest } from '../GenericFunctions';
import { buildCustomFields, buildLines, compact, dateRange, toDateOnly, toId } from '../helpers';
import { getMany, toFlag } from './common';

function buildExpenseRequest(fields: IDataObject): IDataObject {
	return compact({
		company_id: toId(fields.companyId),
		person_id: toId(fields.personId),
		project_id: toId(fields.projectId),
		owner_id: toId(fields.ownerId),
		date: toDateOnly(fields.date),
		due_date: toDateOnly(fields.dueDate),
		currency: fields.currency,
		comment: fields.comment,
		no: fields.no,
		status: fields.status,
		is_chargeable: toFlag(fields.isChargeable),
		is_reimbursable: toFlag(fields.isReimbursable),
	});
}

export async function expenseHandler(
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

		const request = buildExpenseRequest(fields);
		const lines = buildLines(this.getNodeParameter('linesUi', itemIndex, {}));
		if (lines !== undefined) request.lines = lines;

		const customFields = buildCustomFields(this.getNodeParameter('customFieldsUi', itemIndex, {}));
		if (customFields) request.custom_fields = customFields;

		const endpoint =
			operation === 'create'
				? '/expenses/modify'
				: `/expenses/modify/${toId(this.getNodeParameter('expenseId', itemIndex))}`;
		return await scoroApiRequest.call(this, endpoint, { return_data: 1, request });
	}

	if (operation === 'get') {
		const expenseId = toId(this.getNodeParameter('expenseId', itemIndex));
		return await scoroApiRequest.call(this, `/expenses/view/${expenseId}`, { request: {} });
	}

	if (operation === 'delete') {
		const expenseId = toId(this.getNodeParameter('expenseId', itemIndex));
		await scoroApiRequest.call(this, `/expenses/delete/${expenseId}`, { request: {} });
		return { deleted: true, id: expenseId };
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

		return await getMany.call(this, '/expenses/list', filter, itemIndex);
	}

	throw new NodeOperationError(
		this.getNode(),
		`The operation "${operation}" is not supported for expenses`,
		{ itemIndex },
	);
}
