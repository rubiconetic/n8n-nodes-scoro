import type { ILoadOptionsFunctions, INodeListSearchResult, INodeListSearchItems } from 'n8n-workflow';

type ScoroTasks = {
    event_id: number;
    event_name: string;
    activity_type: string;
};

export async function getTasks(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
    const credentials = await this.getCredentials('scoroApi');
    const baseUrl = credentials.baseUrl as string;

    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scoroApi', {
        method: 'POST',
        url: `${baseUrl}/tasks/list`,
        body: { request: { limit: 100 } },
        json: true,
    });

    const results: INodeListSearchItems[] = ((response.data ?? []) as ScoroTasks[]).map((item) => ({
        name: item.event_name + item.activity_type ? ' - ' + item.activity_type : '',
        value: item.event_id,
    }));

    return { results };
}