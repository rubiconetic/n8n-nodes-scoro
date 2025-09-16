import { IExecuteFunctions, INodeExecutionData, IDataObject, NodeOperationError } from 'n8n-workflow';
import { RequestDetails } from '../types';


// Scoro/execute/operations.ts

/**
 * Handles the 'getAll' operation with pagination, batching, and rate limiting.
 */
export async function handleGetAllOperation(
    context: IExecuteFunctions,
    requestDetails: RequestDetails,
    baseBody: IDataObject,
    baseURL: string,
    resource: string,
): Promise<INodeExecutionData[][]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options = context.getNodeParameter('options', 0, {}) as any;
    const returnData: INodeExecutionData[] = [];
    const returnAll = options.pagination?.returnAll ?? false;
    const pageLimit = returnAll ? Infinity : options.pagination?.limit ?? 1;
    const pagesPerBatch = options.batching?.batchSize ?? 10;
    const batchInterval = options.batching?.batchInterval ?? 2000;

    let currentPage = 1;
    let hasMoreData = true;

    let requestBase: IDataObject = { limit: 100 };
    if (resource === 'comment') {
        const module = context.getNodeParameter('module', 0) as string;
        const objectId = context.getNodeParameter('objectId', 0) as string;
        requestBase = { ...requestBase, module, object_id: objectId };
    }


    while (currentPage <= pageLimit && hasMoreData) {
        const batchPromises = [];
        const lastPageInBatch = Math.min(currentPage + pagesPerBatch - 1, pageLimit);

        for (let page = currentPage; page <= lastPageInBatch; page++) {
            const body = {
                ...baseBody,
                request: requestBase,
                filter: options.filter,
                include_deleted: options.includeDeleted ? '1' : undefined,
                page,
            };
            batchPromises.push(
                context.helpers.httpRequest({ baseURL, method: 'POST', url: requestDetails.url, body, json: true }),
            );
        }

        const batchResults = (await Promise.all(batchPromises)) as { data: IDataObject[] }[];

        hasMoreData = false;
        for (const response of batchResults) {
            const results = response.data;
            if (results && results.length > 0) {
                returnData.push(...context.helpers.returnJsonArray(results));
                if (results.length === 100) hasMoreData = true;
            }
        }

        currentPage += pagesPerBatch;

        if (currentPage <= pageLimit && hasMoreData && batchInterval > 0) {
            // @ts-expect-error - setTimeout is a real function
            await new Promise(resolve => setTimeout(resolve, batchInterval));
        }
    }

    return context.prepareOutputData(returnData);
}


/**
 * Handles standard operations (create, update, get, delete) by iterating through input items.
 */
export async function handleStandardOperation(
    context: IExecuteFunctions,
    requestDetails: RequestDetails,
    baseBody: IDataObject,
    baseURL: string,
    resource: string,
    operation: string,
): Promise<INodeExecutionData[][]> {
    const items = context.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
        const body = buildRequestBody(context, i, operation, resource, baseBody);
        const url = context.getNodeParameter('url', i, requestDetails.url) as string;

        const response = await context.helpers.httpRequest({
            baseURL,
            method: requestDetails.method,
            url,
            body,
            json: true,
        });

        const responseData = (response as IDataObject).data || response;
        const dataArray = Array.isArray(responseData) ? responseData : [responseData];
        returnData.push(...context.helpers.returnJsonArray(dataArray));
    }

    return context.prepareOutputData(returnData);
}

/**
 * Helper to construct the request body, handling the specific logic for 'update' operations.
 */

function buildRequestBody(
    context: IExecuteFunctions,
    itemIndex: number,
    operation: string,
    resource: string,
    baseBody: IDataObject,
): IDataObject {
    const body = { ...baseBody };

    if (operation !== 'create' && operation !== 'update') {
        body.request = {};
        return body;
    }

    let requestBody: IDataObject = {};

    // Handle the specific structure for comment creation and updates
    if (resource === 'comment' && (operation === 'create' || operation === 'update')) {
        const module = context.getNodeParameter('module', itemIndex, '') as string;
        const objectId = context.getNodeParameter('objectId', itemIndex, '') as string;
        let comment = context.getNodeParameter('comment', itemIndex, '') as string;
        const userId = context.getNodeParameter('userId', itemIndex, '') as string;

        // Backwards compatibility: if the comment field is empty, try to get it from the request field
        if (!comment) {
            const requestJson = context.getNodeParameter('request', itemIndex, '') as string;
            if (requestJson) {
                try {
                    const parsedRequest = JSON.parse(requestJson);
                    if (typeof parsedRequest.comment === 'string') {
                        comment = parsedRequest.comment;
                    }
                } catch (e) {
                    // Ignore JSON parsing errors
                    // @ts-expect-error console is a method
                    console.error(e);
                }
            }
        }

        requestBody = {
            module,
            object_id: objectId,
            comment,
        };

        if (userId) {
            requestBody.user_id = userId;
        }

    } else {
        const requestJson = context.getNodeParameter('request', itemIndex, '') as string;
        if (requestJson) {
            try {
                requestBody = JSON.parse(requestJson);
            } catch (error) {
                throw new NodeOperationError(
                    context.getNode(),
                    `Invalid JSON in Request field for item ${itemIndex}: ${error.message}`,
                    { itemIndex }
                );
            }
        }
    }

    body.request = requestBody;
    return body;
}