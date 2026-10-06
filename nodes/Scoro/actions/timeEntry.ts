import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { scoroApiRequest } from '../GenericFunctions';
import { compact, dateRange, toDateOnly, toDuration, toId } from '../helpers';
import { composeFilter, getMany, toFlag } from './common';

function buildTimeEntryRequest(fields: IDataObject): IDataObject {
	const dateOnly = toDateOnly(fields.date);
	const startDatetime = fields.startDatetime || dateOnly;
	return compact({
		event_id: toId(fields.eventId),
		user_id: toId(fields.userId),
		duration: toDuration(fields.duration),
		activity_id: toId(fields.activityId),
		billable_duration: toDuration(fields.billableDuration),
		billable_time_type: fields.billableTimeType,
		time_entry_date: dateOnly,
		description: fields.description,
		is_completed: toFlag(fields.isCompleted),
		start_datetime: startDatetime,
	});
}

export async function timeEntryHandler(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[] | undefined> {
	if (operation === 'create' || operation === 'update') {
		const fields =
			operation === 'create'
				? {
						...(this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject),
						eventId: this.getNodeParameter('eventId', itemIndex),
						userId: this.getNodeParameter('userId', itemIndex),
						duration: this.getNodeParameter('duration', itemIndex) as string,
					}
				: (this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject);

		const request = buildTimeEntryRequest(fields);

		const endpoint =
			operation === 'create'
				? '/timeEntries/modify'
				: `/timeEntries/modify/${toId(this.getNodeParameter('timeEntryId', itemIndex))}`;
		return await scoroApiRequest.call(this, endpoint, { return_data: 1, request });
	}

	if (operation === 'get') {
		const timeEntryId = toId(this.getNodeParameter('timeEntryId', itemIndex));
		return await scoroApiRequest.call(this, `/timeEntries/view/${timeEntryId}`, { request: {} });
	}

	if (operation === 'delete') {
		const timeEntryId = toId(this.getNodeParameter('timeEntryId', itemIndex));
		await scoroApiRequest.call(this, `/timeEntries/delete/${timeEntryId}`, { request: {} });
		return { deleted: true, id: timeEntryId };
	}

	if (operation === 'setDone') {
		const timeEntryId = toId(this.getNodeParameter('timeEntryId', itemIndex));
		await scoroApiRequest.call(this, `/timeEntries/setDone/${timeEntryId}`, { request: {} });
		return { success: true, id: timeEntryId };
	}

	if (operation === 'getAll') {
		const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;
		const filter = composeFilter(filters, {
			event_id: toId(filters.eventId),
			user_id: toId(filters.userId),
			is_completed: toFlag(filters.isCompleted),
			time_entry_date: dateRange(filters.dateFrom, filters.dateTo),
			modified_date: dateRange(filters.modifiedFrom, filters.modifiedTo),
		});

		return await getMany.call(this, '/timeEntries/list', filter, itemIndex);
	}

	throw new NodeOperationError(
		this.getNode(),
		`The operation "${operation}" is not supported for time entries`,
		{ itemIndex },
	);
}
