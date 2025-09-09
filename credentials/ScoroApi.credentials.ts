import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ScoroApi implements ICredentialType {
	name = 'scoroApi';
	displayName = 'Scoro API';
	documentationUrl = 'https://api.scoro.com/api/v2';
	properties: INodeProperties[] = [
		{
			displayName: 'Company Account ID',
			name: 'companyAccountId',
			type: 'string',
			default: '',
			placeholder: 'your-company',
			description:
				'Your Scoro company account ID, found in your Scoro URL (e.g., your-company.scoro.com)',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://#company-name#.scoro.com/api/v2'
		}
	];

	// 👇 Corrected Authentication Logic
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			// Send the API key in the request body
			body: {
				company_account_id: '={{$credentials.companyAccountId}}',
				apiKey: '={{$credentials.apiKey}}',
				lang: 'eng'
			},
		},
	};

	// 👇 Corrected Test Request
	test: ICredentialTestRequest = {
		request: {
			// The test request must now be a POST
			method: 'POST',
			baseURL: '={{$credentials.baseUrl}}',
			// Use a 'list' endpoint which is typically a POST request
			url: '/users/list',
			body: {
				// The test request must also send the apiKey in the body
				company_account_id: '={{$credentials.companyAccountId}}',
				apiKey: '={{$credentials.apiKey}}',
				lang: 'eng',
				limit: 1
			},
		},
	};
}