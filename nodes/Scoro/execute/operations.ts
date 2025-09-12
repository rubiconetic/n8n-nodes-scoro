import { IExecuteFunctions, INodeExecutionData, IDataObject, NodeOperationError } from 'n8n-workflow';
import { RequestDetails } from '../types';


/**
 * Handles the 'getAll' operation with pagination, batching, and rate limiting.
 */
export async function handleGetAllOperation(
    context: IExecuteFunctions,
    requestDetails: RequestDetails,
    baseBody: IDataObject,
    baseURL: string,
): Promise<INodeExecutionData[][]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options = context.getNodeParameter('options', 0, {}) as any;
    const returnData: INodeExecutionData[] = [];
    const returnAll = options.pagination?.returnAll ?? false;
    const pageLimit = returnAll ? Infinity : options.pagination?.limit ?? 1;
    const pagesPerBatch = options.batching?.batchSize ?? 10; // Essential Plan is limited to 10 requests per 2 seconds
    const batchInterval = options.batching?.batchInterval ?? 2000; // Default to 2 seconds

    let currentPage = 1;
    let hasMoreData = true;

    while (currentPage <= pageLimit && hasMoreData) {
        const batchPromises = [];
        const lastPageInBatch = Math.min(currentPage + pagesPerBatch - 1, pageLimit);

        for (let page = currentPage; page <= lastPageInBatch; page++) {
            const body = {
                ...baseBody,
                request: { limit: 100 },
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
            // @ts-expect-error setTimeout is a real function
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

    // For operations like 'get' and 'delete', the body just needs API credentials
    if (operation !== 'create' && operation !== 'update') {
        body.request = {};
        return body;
    }

    // For 'create' and 'update', the main payload comes from the 'request' parameter (which is a string)
    const requestJson = context.getNodeParameter('request', itemIndex, '') as string;
    let requestBody: IDataObject = {};

    // Parse the JSON string into an object
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

    body.request = requestBody;
    return body;
}