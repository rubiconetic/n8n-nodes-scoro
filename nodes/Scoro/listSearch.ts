import type {
	IDataObject,
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';

import { scoroApiRequest } from './GenericFunctions';

const PAGE_SIZE = 100;

async function searchList(
	context: ILoadOptionsFunctions,
	endpoint: string,
	filter: IDataObject,
	paginationToken: string | undefined,
	toItem: (row: IDataObject) => INodeListSearchItems,
): Promise<INodeListSearchResult> {
	const page = paginationToken ? Number(paginationToken) : 1;
	const data = await scoroApiRequest.call(context, endpoint, {
		filter,
		page,
		per_page: PAGE_SIZE,
	});
	const rows = Array.isArray(data) ? data : [];
	return {
		results: rows.map(toItem),
		paginationToken: rows.length === PAGE_SIZE ? String(page + 1) : undefined,
	};
}

export async function searchUsers(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	const result = await searchList(this, '/users/list', {}, paginationToken, (row) => ({
		name: String(
			row.full_name ||
				`${row.firstname ?? ''} ${row.lastname ?? ''}`.trim() ||
				row.email ||
				`User ${row.id}`,
		),
		value: row.id as number,
	}));
	// users/list has no documented name filter, so narrow the page client-side.
	if (filter) {
		const needle = filter.toLowerCase();
		result.results = result.results.filter((item) => item.name.toLowerCase().includes(needle));
	}
	return result;
}

export async function searchContacts(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	return await searchList(
		this,
		'/contacts/list',
		filter ? { name: `${filter}%` } : {},
		paginationToken,
		(row) => ({
			name: String(row.search_name || row.name || `Contact ${row.contact_id}`),
			value: row.contact_id as number,
		}),
	);
}

export async function searchProjects(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	return await searchList(
		this,
		'/projects/list',
		filter ? { project_name: `${filter}%` } : {},
		paginationToken,
		(row) => ({
			name: String(row.project_name || `Project ${row.project_id}`),
			value: row.project_id as number,
		}),
	);
}

export async function searchTasks(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	return await searchList(
		this,
		'/tasks/list',
		filter ? { event_name: `${filter}%` } : {},
		paginationToken,
		(row) => ({
			name: String(row.event_name || `Task ${row.event_id}`),
			value: row.event_id as number,
		}),
	);
}
