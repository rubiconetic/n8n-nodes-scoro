import type { ILoadOptionsFunctions, INodeListSearchResult, INodeListSearchItems } from 'n8n-workflow';

type ScoroCompanies = {
    contact_id: number; // Adjust if the ID key is different
    name: string; // Adjust to a descriptive name key
};

export async function getCompanies(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
    const credentials = await this.getCredentials('scoroApi');
    const baseUrl = credentials.baseUrl as string;

    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scoroApi', {
        method: 'POST',
        url: `${baseUrl}/companies/list`,
        body: { request: { limit: 100 } },
        json: true,
    });

    const results: INodeListSearchItems[] = ((response.data ?? []) as ScoroCompanies[]).map((item) => ({
        name: item.name,
        value: item.contact_id,
    }));

    return { results };
}