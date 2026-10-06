import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ScoroApi implements ICredentialType {
	name = 'scoroApi';

	displayName = 'Scoro API';

	icon: Icon = { light: 'file:../icons/scoro.svg', dark: 'file:../icons/scoro.dark.svg' };

	documentationUrl = 'https://api.scoro.com/api/v2';

	properties: INodeProperties[] = [
		{
			displayName: 'Site URL',
			name: 'baseUrl',
			type: 'string',
			default: '',
			placeholder: 'e.g. mycompany or https://mycompany.scoro.com',
			description:
				'Your Scoro site subdomain ("mycompany") or full site URL ("https://mycompany.scoro.com")',
			required: true,
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Found in Scoro under Settings > External Connections > API',
			required: true,
		},
		{
			displayName: 'Company Account ID',
			name: 'companyAccountId',
			type: 'string',
			default: '',
			description:
				'The business entity identifier (company_account_id) listed under Settings > External Connections > API',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			body: {
				apiKey: '={{$credentials.apiKey}}',
				company_account_id: '={{$credentials.companyAccountId}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL:
				'={{ "https://" + $credentials.baseUrl.trim().replace(/^https?:\\/\\//i, "").replace(/\\/.*$/, "").replace(/^([^.]+)$/, "$1.scoro.com") + "/api/v2" }}',
			url: '/companyAccount/list',
			method: 'POST',
			body: {
				apiKey: '={{$credentials.apiKey}}',
				company_account_id: '={{$credentials.companyAccountId}}',
				lang: 'eng',
			},
		},
		rules: [
			{
				type: 'responseSuccessBody',
				properties: {
					key: 'status',
					value: 'ERROR',
					message: 'Scoro rejected the API key or company account ID',
				},
			},
		],
	};
}
