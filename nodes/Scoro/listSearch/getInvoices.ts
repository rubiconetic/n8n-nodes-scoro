import type { ILoadOptionsFunctions, INodeListSearchResult, INodeListSearchItems } from 'n8n-workflow';

type ScoroInvoices = {
    id: number; // Adjust if the ID key is different
    no: number; // Adjust to a descriptive name key
};

export async function getInvoices(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
    const credentials = await this.getCredentials('scoroApi');
    const baseUrl = credentials.baseUrl as string;

    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scoroApi', {
        method: 'POST',
        url: `${baseUrl}/invoices/list`,
        body: { request: { limit: 100 } },
        json: true,
    });

    const results: INodeListSearchItems[] = ((response.data ?? []) as ScoroInvoices[]).map((item) => ({
        name: String(item.no), value: item.id,
    }));

    return { results };
}