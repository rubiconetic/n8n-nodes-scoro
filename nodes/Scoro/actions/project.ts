import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { scoroApiRequest } from '../GenericFunctions';
import {
	buildCustomFields,
	compact,
	dateRange,
	splitList,
	toDateOnly,
	toDuration,
	toId,
} from '../helpers';
import { composeFilter, getMany, toFlag } from './common';

function buildProjectRequest(fields: IDataObject): IDataObject {
	const request = compact({
		project_name: fields.projectName,
		manager_id: toId(fields.managerId),
		company_id: toId(fields.companyId),
		date: toDateOnly(fields.startDate),
		deadline: toDateOnly(fields.deadline),
		duration: toDuration(fields.duration),
		description: fields.description,
		status: fields.status,
		is_private: toFlag(fields.isPrivate),
	});

	const tags = splitList(fields.tags);
	if (tags.length > 0) request.tags = tags;

	return request;
}

export async function projectHandler(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[] | undefined> {
	if (operation === 'create' || operation === 'update') {
		const fields =
			operation === 'create'
				? {
						...(this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject),
						projectName: this.getNodeParameter('projectName', itemIndex) as string,
						managerId: this.getNodeParameter('managerId', itemIndex),
					}
				: (this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject);

		const request = buildProjectRequest(fields);
		const customFields = buildCustomFields(this.getNodeParameter('customFieldsUi', itemIndex, {}));
		if (customFields) request.custom_fields = customFields;

		const endpoint =
			operation === 'create'
				? '/projects/modify'
				: `/projects/modify/${toId(this.getNodeParameter('projectId', itemIndex))}`;
		return await scoroApiRequest.call(this, endpoint, { return_data: 1, request });
	}

	if (operation === 'get') {
		const projectId = toId(this.getNodeParameter('projectId', itemIndex));
		return await scoroApiRequest.call(this, `/projects/view/${projectId}`, { request: {} });
	}

	if (operation === 'delete') {
		const projectId = toId(this.getNodeParameter('projectId', itemIndex));
		await scoroApiRequest.call(this, `/projects/delete/${projectId}`, { request: {} });
		return { deleted: true, id: projectId };
	}

	if (operation === 'getAll') {
		const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;
		const filter = composeFilter(filters, {
			company_id: toId(filters.companyId),
			manager_id: toId(filters.managerId),
			project_name: filters.projectName,
			status: filters.status,
			modified_date: dateRange(filters.modifiedFrom, filters.modifiedTo),
		});
		return await getMany.call(this, '/projects/list', filter, itemIndex);
	}

	throw new NodeOperationError(
		this.getNode(),
		`The operation "${operation}" is not supported for projects`,
		{ itemIndex },
	);
}
