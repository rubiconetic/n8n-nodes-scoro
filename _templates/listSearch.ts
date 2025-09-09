import type { ILoadOptionsFunctions, INodeListSearchResult, INodeListSearchItems } from 'n8n-workflow';

type Scoro__Resource_PascalCase__ = {
    id: number; // Adjust if the ID key is different
    name: string; // Adjust to a descriptive name key
};

export async function get__Resource_PascalCase__(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
    const credentials = await this.getCredentials('scoroApi');
    const baseUrl = credentials.baseUrl as string;

    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scoroApi', {
        method: 'POST',
        url: `${baseUrl}/__resource_plural__/list`,
        body: { request: { limit: 100 } },
        json: true,
    });

    const results: INodeListSearchItems[] = ((response.data ?? []) as Scoro__Resource_PascalCase__[]).map((item) => ({
        name: item.name,
        value: item.id,
    }));

    return { results };
}