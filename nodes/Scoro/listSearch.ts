import type {
	IDataObject,
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';

import { scoroApiRequest, scoroApiRequestAllItems } from './GenericFunctions';

const PAGE_SIZE = 100;
const CLIENT_SEARCH_LIMIT = 500;

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

async function searchListClientFiltered(
	context: ILoadOptionsFunctions,
	endpoint: string,
	filter: string | undefined,
	paginationToken: string | undefined,
	toItem: (row: IDataObject) => INodeListSearchItems,
): Promise<INodeListSearchResult> {
	const trimmed = filter?.trim();
	if (!trimmed) {
		return await searchList(context, endpoint, {}, paginationToken, toItem);
	}
	const rows = await scoroApiRequestAllItems.call(context, endpoint, {}, CLIENT_SEARCH_LIMIT);
	const needle = trimmed.toLowerCase();
	const results = rows
		.map(toItem)
		.filter(
			(item) =>
				item.name.toLowerCase().includes(needle) ||
				String(item.value).toLowerCase().includes(needle),
		);
	return { results };
}

function formatDocumentName(
	prefix: string,
	row: IDataObject,
	id: unknown,
	title?: unknown,
): string {
	const no = row.no !== undefined && row.no !== null && row.no !== '' ? `#${row.no}` : '';
	const label = String(title || row.company_name || row.description || '').trim();
	if (no && label) return `${no} — ${label}`;
	if (label) return label;
	if (no) return `${prefix} ${no}`;
	return `${prefix} ${id}`;
}

export async function searchUsers(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	// users/list has no documented name filter, so fetch all and narrow client-side when filtering.
	return await searchListClientFiltered(this, '/users/list', filter, paginationToken, (row) => ({
		name: String(
			row.full_name ||
				`${row.firstname ?? ''} ${row.lastname ?? ''}`.trim() ||
				row.email ||
				`User ${row.id}`,
		),
		value: row.id as number,
	}));
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

export async function searchCalendarEvents(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	return await searchList(
		this,
		'/calendar/list',
		filter ? { event_name: `${filter}%` } : {},
		paginationToken,
		(row) => {
			const id = (row.event_id ?? row.id) as number;
			return {
				name: String(row.event_name || `Event ${id}`),
				value: id,
			};
		},
	);
}

export async function searchInvoices(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	return await searchListClientFiltered(this, '/invoices/list', filter, paginationToken, (row) => {
		const id = (row.id ?? row.invoice_id) as number;
		return {
			name: formatDocumentName('Invoice', row, id),
			value: id,
		};
	});
}

export async function searchQuotes(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	return await searchListClientFiltered(this, '/quotes/list', filter, paginationToken, (row) => {
		const id = (row.id ?? row.quote_id) as number;
		return {
			name: formatDocumentName('Quote', row, id, row.quote_name),
			value: id,
		};
	});
}

export async function searchOrders(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	return await searchListClientFiltered(this, '/orders/list', filter, paginationToken, (row) => {
		const id = (row.id ?? row.order_id) as number;
		return {
			name: formatDocumentName('Order', row, id),
			value: id,
		};
	});
}

export async function searchPurchaseOrders(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	return await searchListClientFiltered(
		this,
		'/purchaseOrders/list',
		filter,
		paginationToken,
		(row) => {
			const id = (row.id ?? row.purchase_order_id) as number;
			return {
				name: formatDocumentName('Purchase Order', row, id),
				value: id,
			};
		},
	);
}

export async function searchBills(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	return await searchListClientFiltered(this, '/bills/list', filter, paginationToken, (row) => {
		const id = (row.id ?? row.bill_id) as number;
		return {
			name: formatDocumentName('Bill', row, id),
			value: id,
		};
	});
}

export async function searchExpenses(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	return await searchListClientFiltered(this, '/expenses/list', filter, paginationToken, (row) => {
		const id = (row.id ?? row.expense_id) as number;
		return {
			name: formatDocumentName('Expense', row, id, row.comment),
			value: id,
		};
	});
}

export async function searchProducts(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	return await searchList(
		this,
		'/products/list',
		filter ? { name: `${filter}%` } : {},
		paginationToken,
		(row) => {
			const id = (row.product_id ?? row.id) as number;
			const name =
				row.code && row.name
					? `${row.code} — ${row.name}`
					: String(row.name || row.code || `Product ${id}`);
			return {
				name,
				value: id,
			};
		},
	);
}

export async function searchClientProfiles(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	return await searchListClientFiltered(
		this,
		'/clientProfiles/list',
		filter,
		paginationToken,
		(row) => {
			const id = (row.id ?? row.client_profile_id) as number;
			return {
				name: String(row.name || `Client Profile ${id}`),
				value: id,
			};
		},
	);
}

export async function searchRoles(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	return await searchListClientFiltered(this, '/roles/list', filter, paginationToken, (row) => {
		const id = (row.id ?? row.role_id) as number;
		return {
			name: String(row.name || `Role ${id}`),
			value: id,
		};
	});
}

export async function searchPdfTemplates(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	return await searchListClientFiltered(
		this,
		'/pdfTemplates/list',
		filter,
		paginationToken,
		(row) => {
			const id = row.id as number;
			const name = row.template_name
				? row.template_type
					? `${row.template_name} (${row.template_type})`
					: String(row.template_name)
				: String(row.name || `Template ${id}`);
			return {
				name,
				value: id,
			};
		},
	);
}

export async function searchCustomFields(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	return await searchListClientFiltered(
		this,
		'/customFields/list',
		filter,
		paginationToken,
		(row) => {
			const id = String(row.id ?? row.field_id ?? '');
			return {
				name: row.name ? `${row.name} (${id})` : id,
				value: id,
			};
		},
	);
}
