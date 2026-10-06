import assert from 'node:assert/strict';
import { test } from 'node:test';
import helpers from '../dist/nodes/Scoro/helpers.js';
import transport from '../dist/nodes/Scoro/GenericFunctions.js';
import { commentHandler } from '../dist/nodes/Scoro/actions/comment.js';
import { contactHandler } from '../dist/nodes/Scoro/actions/contact.js';
import { invoiceHandler } from '../dist/nodes/Scoro/actions/invoice.js';
import { projectHandler } from '../dist/nodes/Scoro/actions/project.js';
import { taskHandler } from '../dist/nodes/Scoro/actions/task.js';
import { timeEntryHandler } from '../dist/nodes/Scoro/actions/timeEntry.js';
import { apiRequestHandler } from '../dist/nodes/Scoro/actions/apiRequest.js';

const {
	rlValue,
	toId,
	toDateOnly,
	toDuration,
	splitList,
	compact,
	dateRange,
	buildCustomFields,
	buildLines,
} = helpers;
const { getScoroBaseUrl, extractScoroError, scoroApiRequest, scoroApiRequestAllItems } = transport;

function fakeContext(
	responses,
	credentials = { baseUrl: 'acme', apiKey: 'k', companyAccountId: 'c' },
	params = {},
) {
	const calls = [];
	return {
		calls,
		getCredentials: async () => credentials,
		getNode: () => ({
			id: '1',
			name: 'Scoro',
			type: 'n8n-nodes-scoro.scoro',
			typeVersion: 1,
			position: [0, 0],
			parameters: {},
		}),
		getNodeParameter: (name, itemIndex, fallback) => {
			if (params[name] !== undefined) return params[name];
			if (fallback !== undefined) return fallback;
			throw new Error(`Missing parameter: ${name}`);
		},
		helpers: {
			async httpRequestWithAuthentication(credentialType, options) {
				calls.push({ credentialType, options });
				const next = responses.shift();
				if (typeof next === 'function') return next(options);
				return next;
			},
		},
	};
}
const ok = (data) => ({
	statusCode: 200,
	headers: {},
	body: { status: 'OK', statusCode: 200, messages: null, data },
});

test('getScoroBaseUrl normalises every accepted input form', () => {
	for (const input of [
		'acme',
		' acme ',
		'acme.scoro.com',
		'https://acme.scoro.com',
		'https://acme.scoro.com/',
		'HTTPS://acme.scoro.com/api/v2',
		'acme.scoro.com/api/v2/',
	]) {
		assert.equal(getScoroBaseUrl(input), 'https://acme.scoro.com/api/v2', input);
	}
	assert.equal(
		getScoroBaseUrl('https://scoro.example.org/api/v2'),
		'https://scoro.example.org/api/v2',
	);
});

test('extractScoroError flattens arrays, strings and field maps', () => {
	assert.equal(extractScoroError({ error: ['Too many requests'] }), 'Too many requests');
	assert.equal(extractScoroError({ error: 'Bad key' }), 'Bad key');
	assert.equal(
		extractScoroError({ error: { event_id: 'is required', user_id: ['is required'] } }),
		'event_id: is required; user_id: is required',
	);
	assert.equal(extractScoroError(null), 'Unknown Scoro API error');
	assert.equal(extractScoroError('plain'), 'plain');
});

test('helpers', () => {
	assert.equal(rlValue({ __rl: true, mode: 'list', value: 12 }), 12);
	assert.equal(rlValue({ __rl: true, mode: 'id', value: '' }), undefined);
	assert.equal(rlValue('7'), '7');
	assert.equal(toId('42'), 42);
	assert.equal(toId({ __rl: true, value: '42' }), 42);
	assert.equal(toId('={{x}}'), '={{x}}');
	assert.equal(toId(''), undefined);
	assert.equal(toDateOnly('2026-10-05T00:00:00.000+02:00'), '2026-10-05');
	assert.equal(toDateOnly(''), undefined);
	assert.equal(toDuration('90'), '01:30:00');
	assert.equal(toDuration(45), '00:45:00');
	assert.equal(toDuration('1:30'), '01:30:00');
	assert.equal(toDuration('01:30:15'), '01:30:15');
	assert.equal(toDuration('30:00:00'), '30:00:00');
	assert.equal(toDuration(''), undefined);
	assert.deepEqual(splitList(' a, b ,,c '), ['a', 'b', 'c']);
	assert.deepEqual(compact({ a: 0, b: false, c: '', d: null, e: undefined, f: 'x' }), {
		a: 0,
		b: false,
		f: 'x',
	});
	assert.deepEqual(dateRange('2026-01-01T00:00:00', ''), { from_date: '2026-01-01' });
	assert.equal(dateRange('', undefined), undefined);
	assert.deepEqual(
		buildCustomFields({
			field: [
				{ id: 'c_x', value: 'v' },
				{ id: '', value: 'skip' },
			],
		}),
		[{ id: 'c_x', value: 'v' }],
	);
	assert.equal(buildCustomFields({}), undefined);
	assert.deepEqual(
		buildLines({
			lineValues: [
				{
					comment: 'Work',
					amount: 2,
					price: 0,
					vat: '',
					productId: '5',
					unit: '',
					discount: '',
					id: '',
				},
			],
		}),
		[{ product_id: 5, comment: 'Work', amount: 2, price: 0 }],
	);
	assert.equal(buildLines({}), undefined);
});

test('scoroApiRequest builds the URL and body and unwraps data', async () => {
	const ctx = fakeContext([ok({ contact_id: 1 })]);
	const data = await scoroApiRequest.call(ctx, '/contacts/view/1', { request: {} });
	assert.deepEqual(data, { contact_id: 1 });
	const { credentialType, options } = ctx.calls[0];
	assert.equal(credentialType, 'scoroApi');
	assert.equal(options.url, 'https://acme.scoro.com/api/v2/contacts/view/1');
	assert.equal(options.method, 'POST');
	assert.deepEqual(options.body, { lang: 'eng', request: {} });
	assert.equal('apiKey' in options.body, false);
});

test('scoroApiRequest throws the Scoro message on ERROR envelopes, even with HTTP 200', async () => {
	const ctx = fakeContext([
		{
			statusCode: 200,
			headers: {},
			body: { status: 'ERROR', statusCode: 400, messages: { error: ['event_id is required'] } },
		},
	]);
	await assert.rejects(scoroApiRequest.call(ctx, 'timeEntries/modify', {}), /event_id is required/);
});

test('scoroApiRequest rejects an empty Site URL', async () => {
	const ctx = fakeContext([], { baseUrl: '  ' });
	await assert.rejects(scoroApiRequest.call(ctx, 'contacts/list', {}), /Site URL/);
	assert.equal(ctx.calls.length, 0);
});

test('scoroApiRequest retries after a 429 and stops on the daily limit', async () => {
	const limited = {
		statusCode: 429,
		headers: {
			'x-ratelimit-remaining': '0',
			'x-ratelimit-reset': '1',
			'x-daily-requests-remaining': '10',
		},
		body: { status: 'ERROR', statusCode: '429', messages: { error: ['Too many requests'] } },
	};
	const ctx = fakeContext([limited, ok([{ id: 1 }])]);
	assert.deepEqual(await scoroApiRequest.call(ctx, 'users/list', {}), [{ id: 1 }]);
	assert.equal(ctx.calls.length, 2);

	const daily = {
		...limited,
		headers: { ...limited.headers, 'x-daily-requests-remaining': '0' },
	};
	const ctx2 = fakeContext([daily, ok([])]);
	await assert.rejects(scoroApiRequest.call(ctx2, 'users/list', {}), /daily API request limit/);
	assert.equal(ctx2.calls.length, 1);
});

test('scoroApiRequestAllItems keeps per_page constant and never returns duplicates', async () => {
	const rows = Array.from({ length: 230 }, (_, i) => ({ id: i + 1 }));
	const server = (options) => {
		const { page, per_page: perPage } = options.body;
		return ok(rows.slice((page - 1) * perPage, page * perPage));
	};
	let ctx = fakeContext([server, server, server, server]);
	let result = await scoroApiRequestAllItems.call(ctx, 'contacts/list', { filter: {} }, 150);
	assert.deepEqual(
		result.map((r) => r.id),
		rows.slice(0, 150).map((r) => r.id),
	);
	assert.deepEqual(
		ctx.calls.map((c) => c.options.body.per_page),
		[100, 100],
	);

	ctx = fakeContext([server, server, server, server]);
	result = await scoroApiRequestAllItems.call(ctx, 'contacts/list', {}, 0);
	assert.equal(result.length, 230);
	assert.equal(ctx.calls.length, 3);

	ctx = fakeContext([server]);
	result = await scoroApiRequestAllItems.call(ctx, 'contacts/list', {}, 10);
	assert.equal(result.length, 10);
	assert.equal(ctx.calls[0].options.body.per_page, 10);

	ctx = fakeContext([
		server,
		server,
		server,
		server,
		server,
		server,
		server,
		server,
		server,
		server,
	]);
	result = await scoroApiRequestAllItems.call(
		ctx,
		'contacts/list',
		{ detailed_response: true },
		0,
		25,
	);
	assert.equal(result.length, 230);
	assert.equal(ctx.calls[0].options.body.per_page, 25);
});

/* -------------------------------------------------------------------------- */
/*                        Phase 4: Handler Tests                              */
/* -------------------------------------------------------------------------- */

test('Contact create, type person: body has contact_type: person, name, lastname, means_of_contact.email as an array, and no is_company', async () => {
	const ctx = fakeContext([ok({ contact_id: 1 })], undefined, {
		contactType: 'person',
		name: 'John',
		additionalFields: { lastName: 'Doe', email: 'john@example.com' },
		customFieldsUi: {},
	});
	await contactHandler.call(ctx, 'create', 0);
	assert.equal(ctx.calls.length, 1);
	const { options } = ctx.calls[0];
	assert.equal(options.url, 'https://acme.scoro.com/api/v2/contacts/modify');
	assert.equal(options.body.request.contact_type, 'person');
	assert.equal(options.body.request.name, 'John');
	assert.equal(options.body.request.lastname, 'Doe');
	assert.deepEqual(options.body.request.means_of_contact?.email, ['john@example.com']);
	assert.equal('is_company' in options.body.request, false);
});

test('Contact update with only { position: CEO }: request is exactly { position: CEO } — no contact_type, no addresses', async () => {
	const ctx = fakeContext([ok({ contact_id: 1 })], undefined, {
		contactId: '1',
		updateFields: { position: 'CEO' },
		customFieldsUi: {},
	});
	await contactHandler.call(ctx, 'update', 0);
	assert.equal(ctx.calls.length, 1);
	const { options } = ctx.calls[0];
	assert.equal(options.url, 'https://acme.scoro.com/api/v2/contacts/modify/1');
	assert.deepEqual(options.body.request, { position: 'CEO' });
	assert.equal('contact_type' in options.body.request, false);
	assert.equal('addresses' in options.body.request, false);
});

test('Time entry create: event_id and user_id are numbers, duration "90" becomes "01:30:00", date becomes time_entry_date as YYYY-MM-DD', async () => {
	const ctx = fakeContext([ok({ time_entry_id: 1 })], undefined, {
		eventId: '10',
		userId: '20',
		duration: '90',
		additionalFields: { date: '2026-10-05T12:00:00.000Z' },
	});
	await timeEntryHandler.call(ctx, 'create', 0);
	assert.equal(ctx.calls.length, 1);
	const { options } = ctx.calls[0];
	assert.equal(options.url, 'https://acme.scoro.com/api/v2/timeEntries/modify');
	assert.equal(options.body.request.event_id, 10);
	assert.equal(options.body.request.user_id, 20);
	assert.equal(options.body.request.duration, '01:30:00');
	assert.equal(options.body.request.time_entry_date, '2026-10-05');
	assert.equal(options.body.request.start_datetime, '2026-10-05');
});

test('Invoice create with one line whose vat is "": the line has no vat key and has comment, not description', async () => {
	const ctx = fakeContext([ok({ invoice_id: 1 })], undefined, {
		companyId: '5',
		linesUi: {
			lineValues: [
				{
					comment: 'Development work',
					amount: 10,
					price: 100,
					vat: '',
				},
			],
		},
		additionalFields: {},
		customFieldsUi: {},
	});
	await invoiceHandler.call(ctx, 'create', 0);
	assert.equal(ctx.calls.length, 1);
	const { options } = ctx.calls[0];
	assert.equal(options.url, 'https://acme.scoro.com/api/v2/invoices/modify');
	assert.equal(options.body.request.company_id, 5);
	assert.ok(Array.isArray(options.body.request.lines));
	assert.equal(options.body.request.lines.length, 1);
	const line = options.body.request.lines[0];
	assert.equal(line.comment, 'Development work');
	assert.equal('description' in line, false);
	assert.equal('vat' in line, false);
});

test('Task create with relatedUsers: ["3", "4"]: related_users is [3, 4]', async () => {
	const ctx = fakeContext([ok({ event_id: 1 })], undefined, {
		eventName: 'Write tests',
		additionalFields: {
			relatedUsers: ['3', '4'],
		},
		customFieldsUi: {},
	});
	await taskHandler.call(ctx, 'create', 0);
	assert.equal(ctx.calls.length, 1);
	const { options } = ctx.calls[0];
	assert.equal(options.url, 'https://acme.scoro.com/api/v2/tasks/modify');
	assert.equal(options.body.request.event_name, 'Write tests');
	assert.deepEqual(options.body.request.related_users, [3, 4]);
});

test('Task create with parentId: body has parent_id', async () => {
	const ctx = fakeContext([ok({ event_id: 2 })], undefined, {
		eventName: 'Subtask test',
		additionalFields: {
			parentId: '42',
		},
		customFieldsUi: {},
	});
	await taskHandler.call(ctx, 'create', 0);
	assert.equal(ctx.calls.length, 1);
	const { options } = ctx.calls[0];
	assert.equal(options.url, 'https://acme.scoro.com/api/v2/tasks/modify');
	assert.equal(options.body.request.parent_id, 42);
});

test('Task setDone: calls /tasks/setDone/:id with optional completed_datetime', async () => {
	const ctx = fakeContext([ok({})], undefined, {
		taskId: '99',
		completedDatetime: '2026-10-05T19:00:00Z',
	});
	const res = await taskHandler.call(ctx, 'setDone', 0);
	assert.deepEqual(res, { success: true, id: 99 });
	assert.equal(ctx.calls.length, 1);
	const { options } = ctx.calls[0];
	assert.equal(options.url, 'https://acme.scoro.com/api/v2/tasks/setDone/99');
	assert.equal(options.body.request.completed_datetime, '2026-10-05T19:00:00Z');
});

test('Project Get Many with Detailed Response on: per_page is 25 and detailed_response is true', async () => {
	const ctx = fakeContext([ok([])], undefined, {
		filters: {},
		returnAll: false,
		limit: 50,
		options: { detailedResponse: true },
	});
	await projectHandler.call(ctx, 'getAll', 0);
	assert.equal(ctx.calls.length, 1);
	const { options } = ctx.calls[0];
	assert.equal(options.url, 'https://acme.scoro.com/api/v2/projects/list');
	assert.equal(options.body.per_page, 25);
	assert.equal(options.body.detailed_response, true);
});

test('API Request with module "../users": rejects, and no HTTP call is made', async () => {
	const ctx = fakeContext([], undefined, {
		module: '../users',
		apiAction: 'list',
	});
	await assert.rejects(apiRequestHandler.call(ctx, 'send', 0), /invalid/);
	assert.equal(ctx.calls.length, 0);
});

test('API Request whose bodyJson contains apiKey: the sent body has no apiKey', async () => {
	const ctx = fakeContext([ok([])], undefined, {
		module: 'products',
		apiAction: 'list',
		requestJson: {},
		filterJson: {},
		bodyJson: { apiKey: 'stolen_key', detailed_response: true },
		returnAll: false,
		limit: 10,
	});
	await apiRequestHandler.call(ctx, 'send', 0);
	assert.equal(ctx.calls.length, 1);
	const { options } = ctx.calls[0];
	assert.equal(options.url, 'https://acme.scoro.com/api/v2/products/list');
	assert.equal('apiKey' in options.body, false);
	assert.equal(options.body.detailed_response, true);
});

test('Comment create: body has module, object_id, comment and user_id', async () => {
	const ctx = fakeContext([ok({ comment_id: 42 })], undefined, {
		module: 'tasks',
		objectId: '10',
		comment: 'Work in progress',
		additionalFields: {
			userId: '3',
		},
	});
	await commentHandler.call(ctx, 'create', 0);
	assert.equal(ctx.calls.length, 1);
	const { options } = ctx.calls[0];
	assert.equal(options.url, 'https://acme.scoro.com/api/v2/comments/modify');
	assert.equal(options.body.request.module, 'tasks');
	assert.equal(options.body.request.object_id, 10);
	assert.equal(options.body.request.comment, 'Work in progress');
	assert.equal(options.body.request.user_id, 3);
});

test('Comment update: url is /comments/modify/:id with updated comment', async () => {
	const ctx = fakeContext([ok({ comment_id: 42 })], undefined, {
		commentId: '42',
		comment: 'Updated content',
		updateFields: {},
	});
	await commentHandler.call(ctx, 'update', 0);
	assert.equal(ctx.calls.length, 1);
	const { options } = ctx.calls[0];
	assert.equal(options.url, 'https://acme.scoro.com/api/v2/comments/modify/42');
	assert.equal(options.body.request.comment, 'Updated content');
});

test('Comment delete: url is /comments/delete/:id', async () => {
	const ctx = fakeContext([ok({ deleted: true })], undefined, {
		commentId: '42',
	});
	const result = await commentHandler.call(ctx, 'delete', 0);
	assert.equal(ctx.calls.length, 1);
	const { options } = ctx.calls[0];
	assert.equal(options.url, 'https://acme.scoro.com/api/v2/comments/delete/42');
	assert.deepEqual(result, { deleted: true, id: 42 });
});

test('Comment getAll: calls /comments/list with module and object_id in filter and request', async () => {
	const ctx = fakeContext([ok([{ comment_id: 1, comment: 'First' }])], undefined, {
		module: 'projects',
		objectId: '99',
		filters: {},
		returnAll: true,
		options: {},
	});
	const result = await commentHandler.call(ctx, 'getAll', 0);
	assert.equal(ctx.calls.length, 1);
	const { options } = ctx.calls[0];
	assert.equal(options.url, 'https://acme.scoro.com/api/v2/comments/list');
	assert.equal(options.body.filter.module, 'projects');
	assert.equal(options.body.filter.object_id, 99);
	assert.equal(options.body.request.module, 'projects');
	assert.equal(options.body.request.object_id, 99);
	assert.equal(result.length, 1);
});
