import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { scoroApiRequest } from '../GenericFunctions';
import { buildCustomFields, compact, dateRange, splitList, toDuration, toId } from '../helpers';
import { getMany, toFlag } from './common';

function buildTaskRequest(fields: IDataObject): IDataObject {
	const request = compact({
		event_name: fields.eventName,
		company_id: toId(fields.companyId),
		person_id: toId(fields.personId),
		project_id: toId(fields.projectId),
		owner_id: toId(fields.ownerId),
		billable_time_type: fields.billableTimeType,
		priority_id: fields.priorityId,
		status: fields.status,
		start_datetime: fields.startDatetime,
		datetime_due: fields.datetimeDue,
		duration_planned: toDuration(fields.durationPlanned),
		description: fields.description,
		is_completed: toFlag(fields.isCompleted),
	});

	if (fields.relatedUsers !== undefined && fields.relatedUsers !== null) {
		const list = Array.isArray(fields.relatedUsers)
			? fields.relatedUsers
			: splitList(fields.relatedUsers);
		const relatedUsers = list.map((u) => toId(u)).filter((id): id is number => id !== undefined);
		if (relatedUsers.length > 0) {
			request.related_users = relatedUsers;
		}
	}

	return request;
}

export async function taskHandler(
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

		const request = buildTaskRequest(fields);
		const customFields = buildCustomFields(this.getNodeParameter('customFieldsUi', itemIndex, {}));
		if (customFields) request.custom_fields = customFields;

		const endpoint =
			operation === 'create'
				? '/tasks/modify'
				: `/tasks/modify/${toId(this.getNodeParameter('taskId', itemIndex))}`;
		return await scoroApiRequest.call(this, endpoint, { return_data: 1, request });
	}

	if (operation === 'get') {
		const taskId = toId(this.getNodeParameter('taskId', itemIndex));
		return await scoroApiRequest.call(this, `/tasks/view/${taskId}`, { request: {} });
	}

	if (operation === 'delete') {
		const taskId = toId(this.getNodeParameter('taskId', itemIndex));
		await scoroApiRequest.call(this, `/tasks/delete/${taskId}`, { request: {} });
		return { deleted: true, id: taskId };
	}

	if (operation === 'getAll') {
		const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;
		const filter = compact({
			company_id: toId(filters.companyId),
			datetime_due: dateRange(filters.dueFrom, filters.dueTo),
			is_completed: toFlag(filters.isCompleted),
			owner_id: toId(filters.ownerId),
			project_id: toId(filters.projectId),
			status: filters.status,
			modified_date: dateRange(filters.modifiedFrom, filters.modifiedTo),
		});

		const options = this.getNodeParameter('options', itemIndex, {}) as IDataObject;
		const extraBody: IDataObject = {};
		if (options.includeSubtasks) {
			extraBody.include_subtasks = 1;
		}

		return await getMany.call(this, '/tasks/list', filter, itemIndex, extraBody);
	}

	throw new NodeOperationError(
		this.getNode(),
		`The operation "${operation}" is not supported for tasks`,
		{ itemIndex },
	);
}
