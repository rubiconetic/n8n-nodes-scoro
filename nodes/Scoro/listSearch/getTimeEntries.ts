import type { ILoadOptionsFunctions, INodeListSearchResult, INodeListSearchItems } from 'n8n-workflow';

type ScoroTimeEntry = {
    time_entry_id: number;
    title: string;
    time_entry_type: string;
};

export async function getTimeEntries(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
    const credentials = await this.getCredentials('scoroApi');
    const baseUrl = credentials.baseUrl as string;

    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scoroApi', {
        method: 'POST',
        url: `${baseUrl}/timeEntries/list`,
        body: { request: { limit: 100 } },
        json: true,
    });

    const results: INodeListSearchItems[] = ((response.data ?? []) as ScoroTimeEntry[]).map((item) => ({
        name: item.title + ' - ' + item.time_entry_type,
        value: item.time_entry_id,
    }));

    return { results };
}