import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { scoroApiRequest } from '../GenericFunctions';
import { buildCustomFields, compact, dateRange, toId } from '../helpers';
import { composeFilter, getMany, toFlag } from './common';

function buildCalendarEventRequest(fields: IDataObject): IDataObject {
	return compact({
		event_name: fields.eventName,
		start_datetime: fields.startDatetime,
		end_datetime: fields.endDatetime,
		description: fields.description,
		address: fields.address,
		status: fields.status,
		full_day_event: toFlag(fields.fullDayEvent),
		is_personal: toFlag(fields.isPersonal),
		company_id: toId(fields.companyId),
		person_id: toId(fields.personId),
		project_id: toId(fields.projectId),
		owner_id: toId(fields.ownerId),
		related_task_id: toId(fields.relatedTaskId),
		call_link: fields.callLink,
	});
}

export async function calendarEventHandler(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[] | undefined> {
	if (operation === 'create' || operation === 'update') {
		const fields =
			operation === 'create'
				? {
						...(this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject),
						eventName: this.getNodeParameter('eventName', itemIndex) as string,
					}
				: (this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject);

		const request = buildCalendarEventRequest(fields);
		const customFields = buildCustomFields(this.getNodeParameter('customFieldsUi', itemIndex, {}));
		if (customFields) request.custom_fields = customFields;

		const endpoint =
			operation === 'create'
				? '/calendar/modify'
				: `/calendar/modify/${toId(this.getNodeParameter('eventId', itemIndex))}`;
		return await scoroApiRequest.call(this, endpoint, { return_data: 1, request });
	}

	if (operation === 'get') {
		const eventId = toId(this.getNodeParameter('eventId', itemIndex));
		return await scoroApiRequest.call(this, `/calendar/view/${eventId}`, { request: {} });
	}

	if (operation === 'delete') {
		const eventId = toId(this.getNodeParameter('eventId', itemIndex));
		await scoroApiRequest.call(this, `/calendar/delete/${eventId}`, { request: {} });
		return { deleted: true, id: eventId };
	}

	if (operation === 'getAll') {
		const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;
		const filter = composeFilter(filters, {
			company_id: toId(filters.companyId),
			owner_id: toId(filters.ownerId),
			project_id: toId(filters.projectId),
			status: filters.status,
			start_datetime: dateRange(filters.startFrom, filters.startTo),
			modified_date: dateRange(filters.modifiedFrom, filters.modifiedTo),
		});

		return await getMany.call(this, '/calendar/list', filter, itemIndex);
	}

	throw new NodeOperationError(
		this.getNode(),
		`The operation "${operation}" is not supported for calendar events`,
		{ itemIndex },
	);
}
