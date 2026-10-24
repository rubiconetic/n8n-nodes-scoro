import type { IDataObject, INode } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

const FALLBACK_NODE: INode = {
	id: 'scoro',
	name: 'Scoro',
	type: 'n8n-nodes-scoro.scoro',
	typeVersion: 1,
	position: [0, 0],
	parameters: {},
};

/** Returns the plain value of a parameter that may be a resource locator object. */
export function rlValue(value: unknown): string | number | undefined {
	if (value === null || value === undefined) return undefined;
	if (typeof value === 'object') {
		const inner = (value as IDataObject).value;
		return inner === '' || inner === null || inner === undefined
			? undefined
			: (inner as string | number);
	}
	return value === '' ? undefined : (value as string | number);
}

/** Numeric strings become numbers (Scoro validates IDs as integers); anything else is returned unchanged. */
export function toId(value: unknown): string | number | undefined {
	const plain = rlValue(value);
	if (plain === undefined) return undefined;
	return /^\d+$/.test(String(plain).trim()) ? Number(plain) : plain;
}

/** "2026-10-05T00:00:00.000+02:00" -> "2026-10-05". */
export function toDateOnly(value: unknown): string | undefined {
	if (value === null || value === undefined || value === '') return undefined;
	const text = String(value);
	return /^\d{4}-\d{2}-\d{2}/.test(text) ? text.slice(0, 10) : text;
}

/** Accepts minutes ("90" or 90), "H:MM" or "HH:MM:SS" and returns Scoro's HH:MM:SS. */
export function toDuration(value: unknown): string | undefined {
	if (value === null || value === undefined || value === '') return undefined;
	const text = String(value).trim();
	const pad = (n: number) => String(n).padStart(2, '0');
	if (/^\d+$/.test(text)) {
		const minutes = Number(text);
		return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}:00`;
	}
	const match = /^(\d+):(\d{1,2})(?::(\d{1,2}))?$/.exec(text);
	if (match) {
		return `${pad(Number(match[1]))}:${pad(Number(match[2]))}:${pad(Number(match[3] ?? 0))}`;
	}
	return text;
}

/** "a, b ,c" -> ["a", "b", "c"]. */
export function splitList(value: unknown): string[] {
	if (Array.isArray(value)) return value.map((entry) => String(entry).trim()).filter(Boolean);
	if (value === null || value === undefined) return [];
	return String(value)
		.split(',')
		.map((entry) => entry.trim())
		.filter(Boolean);
}

/** Drops keys whose value is undefined, null or an empty string. Keeps 0 and false. */
export function compact(input: IDataObject): IDataObject {
	const output: IDataObject = {};
	for (const [key, value] of Object.entries(input)) {
		if (value !== undefined && value !== null && value !== '') output[key] = value;
	}
	return output;
}

/** Builds Scoro's range filter object, or undefined when both ends are empty. */
export function dateRange(from: unknown, to: unknown): IDataObject | undefined {
	const range = compact({ from_date: toDateOnly(from), to_date: toDateOnly(to) });
	return Object.keys(range).length > 0 ? range : undefined;
}

/** fixedCollection { field: [{ id, value }] } -> Scoro custom_fields array, or undefined when empty. */
export function buildCustomFields(ui: unknown): IDataObject[] | undefined {
	const rows = ((ui as IDataObject | undefined)?.field as IDataObject[] | undefined) ?? [];
	const fields = rows
		.map((row) => ({ id: rlValue(row.id), value: row.value }))
		.filter((row) => row.id !== undefined && String(row.id).trim() !== '')
		.map((row) => ({ id: String(row.id).trim(), value: row.value }));
	return fields.length > 0 ? fields : undefined;
}

/** fixedCollection { lineValues: [...] } -> Scoro document lines, or undefined when empty. */
export function buildLines(ui: unknown): IDataObject[] | undefined {
	const rows = ((ui as IDataObject | undefined)?.lineValues as IDataObject[] | undefined) ?? [];
	const lines = rows.map((row) =>
		compact({
			id: toId(row.id),
			product_id: toId(row.productId),
			comment: row.comment,
			amount: row.amount,
			price: row.price,
			unit: row.unit,
			vat: row.vat === '' || row.vat === undefined ? undefined : Number(row.vat),
			discount:
				row.discount === '' || row.discount === undefined ? undefined : Number(row.discount),
		}),
	);
	return lines.length > 0 ? lines : undefined;
}

/** fixedCollection { field: [{ id, value }] } -> Scoro filter.custom_fields object { id: value } */
export function buildCustomFieldsFilter(ui: unknown): IDataObject | undefined {
	const rows = ((ui as IDataObject | undefined)?.field as IDataObject[] | undefined) ?? [];
	const filter: IDataObject = {};
	for (const row of rows) {
		const id = rlValue(row.id);
		if (
			id !== undefined &&
			String(id).trim() !== '' &&
			row.value !== undefined &&
			row.value !== ''
		) {
			filter[String(id).trim()] = row.value;
		}
	}
	return Object.keys(filter).length > 0 ? filter : undefined;
}

/** Parses a JSON string or object for custom/raw filter criteria. Throws on malformed JSON. */
export function parseCustomFilters(
	input: unknown,
	node: INode = FALLBACK_NODE,
): IDataObject | undefined {
	if (input === undefined || input === null || input === '') return undefined;
	if (typeof input === 'object') {
		if (Array.isArray(input)) {
			throw new NodeOperationError(node, 'Custom Filters (JSON) must be a JSON object');
		}
		return compact(input as IDataObject);
	}
	if (typeof input === 'string') {
		const trimmed = input.trim();
		if (!trimmed) return undefined;
		let parsed: unknown;
		try {
			parsed = JSON.parse(trimmed);
		} catch {
			throw new NodeOperationError(node, 'Custom Filters (JSON) is not valid JSON');
		}
		if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
			throw new NodeOperationError(node, 'Custom Filters (JSON) must be a JSON object');
		}
		return compact(parsed as IDataObject);
	}
	throw new NodeOperationError(node, 'Custom Filters (JSON) must be a JSON object');
}
