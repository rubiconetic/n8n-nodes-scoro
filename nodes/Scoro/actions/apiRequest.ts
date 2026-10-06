import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { jsonParse, NodeOperationError } from 'n8n-workflow';

import { scoroApiRequest, scoroApiRequestAllItems } from '../GenericFunctions';

function parseJsonField(
	executeFunctions: IExecuteFunctions,
	paramName: string,
	value: unknown,
	itemIndex: number,
): IDataObject {
	if (value === undefined || value === null || value === '') return {};
	if (typeof value === 'object' && !Array.isArray(value)) return value as IDataObject;
	if (typeof value === 'string') {
		try {
			const parsed = jsonParse(value);
			if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
				return parsed as IDataObject;
			}
			throw new Error('Must be a JSON object');
		} catch (error) {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				`Invalid JSON in parameter "${paramName}": ${(error as Error).message}`,
				{ itemIndex },
			);
		}
	}
	throw new NodeOperationError(
		executeFunctions.getNode(),
		`Parameter "${paramName}" must be a valid JSON object`,
		{ itemIndex },
	);
}

export async function apiRequestHandler(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[] | undefined> {
	if (operation !== 'send') {
		throw new NodeOperationError(
			this.getNode(),
			`The operation "${operation}" is not supported for API requests`,
			{ itemIndex },
		);
	}

	const module = (this.getNodeParameter('module', itemIndex) as string).trim();
	if (!/^[A-Za-z]+$/.test(module)) {
		throw new NodeOperationError(
			this.getNode(),
			`The module "${module}" is invalid. It must contain only letters.`,
			{ itemIndex },
		);
	}

	const action = this.getNodeParameter('apiAction', itemIndex, 'list') as string;
	let actionName = action;
	if (action === 'other') {
		actionName = (this.getNodeParameter('actionName', itemIndex) as string).trim();
		if (!/^[A-Za-z]+$/.test(actionName)) {
			throw new NodeOperationError(
				this.getNode(),
				`The action name "${actionName}" is invalid. It must contain only letters.`,
				{ itemIndex },
			);
		}
	}

	const recordId = (this.getNodeParameter('recordId', itemIndex, '') as string).trim();
	if (recordId && !/^[A-Za-z0-9_-]*$/.test(recordId)) {
		throw new NodeOperationError(
			this.getNode(),
			`The record ID "${recordId}" is invalid. It must contain only letters, numbers, underscores, or hyphens.`,
			{ itemIndex },
		);
	}

	const requestRaw = this.getNodeParameter('requestJson', itemIndex, {});
	const request = parseJsonField(this, 'requestJson', requestRaw, itemIndex);

	const bodyRaw = this.getNodeParameter('bodyJson', itemIndex, {});
	const body = parseJsonField(this, 'bodyJson', bodyRaw, itemIndex);
	delete body.apiKey;
	delete body.company_account_id;
	delete body.user_token;

	let endpoint = `/${module}/${actionName}`;
	if (recordId) {
		endpoint += `/${recordId}`;
	}

	if (action === 'list') {
		const filterRaw = this.getNodeParameter('filterJson', itemIndex, {});
		const filter = parseJsonField(this, 'filterJson', filterRaw, itemIndex);

		const returnAll = this.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = returnAll ? 0 : (this.getNodeParameter('limit', itemIndex, 50) as number);
		const maxPageSize = body.detailed_response ? 25 : 100;

		return await scoroApiRequestAllItems.call(
			this,
			endpoint,
			{ ...body, request, filter },
			limit,
			maxPageSize,
		);
	}

	const result = await scoroApiRequest.call(this, endpoint, { ...body, request });
	return result ?? { success: true };
}
