import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';

import { scoroApiRequestAllItems } from '../GenericFunctions';
import { compact, toDateOnly, toId } from '../helpers';

export type ResourceHandler = (
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
) => Promise<IDataObject | IDataObject[] | undefined>;

/** Shared Get Many: reads returnAll, limit and the "options" collection, then pages through the list. */
export async function getMany(
	this: IExecuteFunctions,
	endpoint: string,
	filter: IDataObject,
	itemIndex: number,
	extraBody: IDataObject = {},
): Promise<IDataObject[]> {
	const returnAll = this.getNodeParameter('returnAll', itemIndex, false) as boolean;
	const limit = returnAll ? 0 : (this.getNodeParameter('limit', itemIndex, 50) as number);
	const options = this.getNodeParameter('options', itemIndex, {}) as IDataObject;

	const body: IDataObject = { filter, ...extraBody };
	if (options.detailedResponse) body.detailed_response = true;
	if (options.includeDeleted) body.include_deleted = 1;

	// Scoro caps detailed responses at 25 rows per page.
	const maxPageSize = options.detailedResponse ? 25 : 100;
	return await scoroApiRequestAllItems.call(this, endpoint, body, limit, maxPageSize);
}

/** 1/0 for a boolean that the user explicitly set, otherwise undefined. */
export function toFlag(value: unknown): number | undefined {
	if (value === undefined || value === null || value === '') return undefined;
	return value ? 1 : 0;
}

/** Builds a Scoro document request body (shared by Invoice and Quote). */
export function buildDocumentRequest(fields: IDataObject): IDataObject {
	return compact({
		company_id: toId(fields.companyId),
		person_id: toId(fields.personId),
		project_id: toId(fields.projectId),
		owner_id: toId(fields.ownerId),
		date: toDateOnly(fields.date),
		deadline: toDateOnly(fields.deadline),
		currency: fields.currency,
		description: fields.description,
		discount: fields.discount,
		no: fields.no,
		is_sent: toFlag(fields.isSent),
		payment_type: fields.paymentType,
		reference_no: fields.referenceNo,
		estimated_closing_date: toDateOnly(fields.estimatedClosingDate),
		quote_name: fields.quoteName,
		status: fields.status,
	});
}
