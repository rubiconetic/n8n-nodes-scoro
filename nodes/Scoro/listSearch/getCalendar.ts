import type { ILoadOptionsFunctions, INodeListSearchResult, INodeListSearchItems } from 'n8n-workflow';

type ScoroCalendar = {
    event_id: number;
    start_datetime: string;
    end_datetime: string;
};

export async function getCalendarEvents(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
    const credentials = await this.getCredentials('scoroApi');
    const baseUrl = credentials.baseUrl as string;

    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scoroApi', {
        method: 'POST',
        url: `${baseUrl}/calendar/list`,
        body: { request: { limit: 100 } },
        json: true,
    });

    const results: INodeListSearchItems[] = ((response.data ?? []) as ScoroCalendar[]).map((item) => ({
        name: `${item.start_datetime} - ${item.end_datetime}`,
        value: item.event_id,
    }));

    return { results };
}