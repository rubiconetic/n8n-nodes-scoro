import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { scoroApiRequest } from '../GenericFunctions';
import { buildCustomFields, compact, dateRange, splitList, toId } from '../helpers';
import { getMany, toFlag } from './common';

function buildContactRequest(fields: IDataObject): IDataObject {
	const request = compact({
		name: fields.name,
		lastname: fields.lastName,
		contact_type: fields.contactType,
		id_code: fields.idCode,
		vatno: fields.vatNo,
		bankaccount: fields.bankAccount,
		position: fields.position,
		comments: fields.comments,
		reference_no: fields.referenceNo,
		manager_id: toId(fields.managerId),
		is_client: toFlag(fields.isClient),
		is_supplier: toFlag(fields.isSupplier),
	});

	const tags = splitList(fields.tags);
	if (tags.length > 0) request.tags = tags;

	const meansOfContact: IDataObject = {};
	for (const key of ['email', 'phone', 'mobile', 'website']) {
		if (fields[key]) meansOfContact[key] = [fields[key]];
	}
	if (Object.keys(meansOfContact).length > 0) request.means_of_contact = meansOfContact;

	// Only send the address parts the user filled in: empty strings would blank existing values.
	const address = compact({
		contacts_addresses_id: toId(fields.addressId),
		street: fields.street,
		city: fields.city,
		zipcode: fields.zipcode,
		country: fields.country,
	});
	if (Object.keys(address).length > 0) request.addresses = [address];

	return request;
}

export async function contactHandler(
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
						contactType: this.getNodeParameter('contactType', itemIndex) as string,
					}
				: (this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject);

		const request = buildContactRequest(fields);
		const customFields = buildCustomFields(this.getNodeParameter('customFieldsUi', itemIndex, {}));
		if (customFields) request.custom_fields = customFields;

		const endpoint =
			operation === 'create'
				? '/contacts/modify'
				: `/contacts/modify/${toId(this.getNodeParameter('contactId', itemIndex))}`;
		return await scoroApiRequest.call(this, endpoint, { return_data: 1, request });
	}

	if (operation === 'get') {
		const contactId = toId(this.getNodeParameter('contactId', itemIndex));
		return await scoroApiRequest.call(this, `/contacts/view/${contactId}`, { request: {} });
	}

	if (operation === 'delete') {
		const contactId = toId(this.getNodeParameter('contactId', itemIndex));
		await scoroApiRequest.call(this, `/contacts/delete/${contactId}`, { request: {} });
		return { deleted: true, id: contactId };
	}

	if (operation === 'getAll') {
		const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;
		const filter = compact({
			name: filters.name,
			contact_type: filters.contactType,
			manager_id: toId(filters.managerId),
			is_client: toFlag(filters.isClient),
			is_supplier: toFlag(filters.isSupplier),
			modified_date: dateRange(filters.modifiedFrom, filters.modifiedTo),
		});
		return await getMany.call(this, '/contacts/list', filter, itemIndex);
	}

	throw new NodeOperationError(
		this.getNode(),
		`The operation "${operation}" is not supported for contacts`,
		{ itemIndex },
	);
}
