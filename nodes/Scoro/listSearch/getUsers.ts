import type {
    ILoadOptionsFunctions,
    INodeListSearchResult,
    INodeListSearchItems,
} from 'n8n-workflow';

type ScoroUser = {
    id: number;
    full_name: string;
    email: string;
};

export async function getUsers(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
    const credentials = await this.getCredentials('scoroApi');
    const baseUrl = credentials.baseUrl as string;

    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scoroApi', {
        method: 'POST',
        url: `${baseUrl}/users/list`,
        body: {
            request: {
                limit: 100,
            },
        },
        json: true,
    });

    const results: INodeListSearchItems[] = ((response.data ?? []) as ScoroUser[]).map((user) => ({
        name: `${user.full_name} (${user.email})`,
        value: user.id,
    }));

    return { results };
}