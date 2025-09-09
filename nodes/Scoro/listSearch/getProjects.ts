import type {
    ILoadOptionsFunctions,
    INodeListSearchResult,
    INodeListSearchItems,
} from 'n8n-workflow';

type ScoroProject = {
    project_id: number;
    project_name: string;
    company_name: string;
};

export async function getProjects(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
    // Manually get the credentials to access the Base URL
    const credentials = await this.getCredentials('scoroApi');
    const baseUrl = credentials.baseUrl as string;

    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scoroApi', {
        method: 'POST',
        // 👇 Construct the full URL manually
        url: `${baseUrl}/projects/list`,
        body: {
            request: {
                limit: 100,
            },
        },
        json: true,
    });

    const results: INodeListSearchItems[] = ((response.data ?? []) as ScoroProject[]).map((project) => ({
        name: `${project.project_name} (${project.company_name})`,
        value: project.project_id,
    }));

    return { results };
}