import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	IWebhookFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError, sleep } from 'n8n-workflow';

type ScoroContext = IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions;

interface ScoroEnvelope {
	status?: string;
	statusCode?: number | string;
	messages?: unknown;
	data?: unknown;
}

interface ScoroFullResponse {
	statusCode: number;
	headers: Record<string, string | string[] | undefined>;
	body: ScoroEnvelope | string;
}

const MAX_RATE_LIMIT_RETRIES = 5;
const MAX_RATE_LIMIT_WAIT_SECONDS = 10;

export function getScoroBaseUrl(siteUrl: string): string {
	let host = siteUrl
		.trim()
		.replace(/^https?:\/\//i, '')
		.replace(/\/.*$/, '');
	if (host !== '' && !host.includes('.')) {
		host = `${host}.scoro.com`;
	}
	return `https://${host}/api/v2`;
}

export function extractScoroError(messages: unknown): string {
	const parts: string[] = [];
	const walk = (value: unknown, label?: string) => {
		if (value === null || value === undefined || value === '') return;
		if (Array.isArray(value)) {
			for (const entry of value) walk(entry, label);
		} else if (typeof value === 'object') {
			for (const [key, entry] of Object.entries(value as IDataObject)) {
				walk(entry, /^\d+$/.test(key) || key === 'error' ? label : key);
			}
		} else {
			parts.push(label ? `${label}: ${String(value)}` : String(value));
		}
	};
	walk(messages);
	return parts.length > 0 ? parts.join('; ') : 'Unknown Scoro API error';
}

function headerNumber(headers: ScoroFullResponse['headers'], name: string): number {
	const value = headers?.[name];
	return Number(Array.isArray(value) ? value[0] : value);
}

export type ScoroData = IDataObject | IDataObject[] | undefined;

export async function scoroApiRequest(
	this: ScoroContext,
	endpoint: string,
	body: IDataObject = {},
): Promise<ScoroData> {
	const credentials = await this.getCredentials('scoroApi');
	const siteUrl = String(credentials.baseUrl ?? '');
	const baseUrl = getScoroBaseUrl(siteUrl);
	if (!/^https:\/\/[a-z0-9.-]+\/api\/v2$/i.test(baseUrl)) {
		throw new NodeOperationError(
			this.getNode(),
			'The Site URL in the Scoro credentials is empty or invalid',
		);
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${baseUrl}/${endpoint.replace(/^\/+/, '')}`,
		body: { lang: 'eng', ...body },
		json: true,
		returnFullResponse: true,
		ignoreHttpStatusErrors: true,
	};

	for (let attempt = 0; ; attempt++) {
		let response: ScoroFullResponse;
		try {
			response = (await this.helpers.httpRequestWithAuthentication.call(
				this,
				'scoroApi',
				options,
			)) as ScoroFullResponse;
		} catch (error) {
			throw new NodeApiError(this.getNode(), error as JsonObject);
		}

		const envelope: ScoroEnvelope =
			typeof response.body === 'object' && response.body !== null ? response.body : {};
		const httpCode = Number(response.statusCode);

		if (httpCode === 429 || String(envelope.statusCode) === '429') {
			if (headerNumber(response.headers, 'x-daily-requests-remaining') === 0) {
				throw new NodeApiError(this.getNode(), envelope as JsonObject, {
					message: 'Scoro daily API request limit reached',
					description: 'The daily limit resets at midnight UTC.',
					httpCode: '429',
				});
			}
			if (attempt < MAX_RATE_LIMIT_RETRIES) {
				const reset = headerNumber(response.headers, 'x-ratelimit-reset');
				const waitSeconds = Math.min(
					Math.max(Number.isFinite(reset) ? reset : 2, 1),
					MAX_RATE_LIMIT_WAIT_SECONDS,
				);
				await sleep(waitSeconds * 1000);
				continue;
			}
		}

		if (httpCode >= 400 || envelope.status === 'ERROR') {
			throw new NodeApiError(this.getNode(), envelope as JsonObject, {
				message: extractScoroError(envelope.messages),
				httpCode: String(httpCode),
			});
		}

		return envelope.data as ScoroData;
	}
}

export async function scoroApiRequestAllItems(
	this: ScoroContext,
	endpoint: string,
	body: IDataObject = {},
	limit = 0,
	maxPageSize = 100,
): Promise<IDataObject[]> {
	// per_page MUST stay constant across pages, otherwise page offsets shift and rows repeat.
	const perPage = limit > 0 ? Math.min(limit, maxPageSize) : maxPageSize;
	const returnData: IDataObject[] = [];

	for (let page = 1; ; page++) {
		const data = await scoroApiRequest.call(this, endpoint, {
			...body,
			page,
			per_page: perPage,
		});
		const items = Array.isArray(data) ? data : [];
		returnData.push(...items);
		if (items.length < perPage) break;
		if (limit > 0 && returnData.length >= limit) break;
	}

	return limit > 0 ? returnData.slice(0, limit) : returnData;
}
