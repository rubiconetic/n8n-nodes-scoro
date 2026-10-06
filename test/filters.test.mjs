import assert from 'node:assert/strict';
import { test } from 'node:test';
import helpers from '../dist/nodes/Scoro/helpers.js';
import { composeFilter } from '../dist/nodes/Scoro/actions/common.js';
import { contactHandler } from '../dist/nodes/Scoro/actions/contact.js';
import { projectHandler } from '../dist/nodes/Scoro/actions/project.js';
import { taskHandler } from '../dist/nodes/Scoro/actions/task.js';
import { invoiceHandler } from '../dist/nodes/Scoro/actions/invoice.js';
import { userHandler } from '../dist/nodes/Scoro/actions/user.js';

const { buildCustomFieldsFilter, parseCustomFilters } = helpers;

function fakeContext(responses, params = {}) {
	const calls = [];
	return {
		calls,
		getCredentials: async () => ({ baseUrl: 'acme', apiKey: 'k', companyAccountId: 'c' }),
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

test('buildCustomFieldsFilter converts fixedCollection into key-value map', () => {
	assert.equal(buildCustomFieldsFilter(undefined), undefined);
	assert.equal(buildCustomFieldsFilter({}), undefined);
	assert.equal(buildCustomFieldsFilter({ field: [] }), undefined);
	assert.equal(buildCustomFieldsFilter({ field: [{ id: '', value: 'test' }] }), undefined);
	assert.equal(buildCustomFieldsFilter({ field: [{ id: 'c_field', value: '' }] }), undefined);

	const single = buildCustomFieldsFilter({
		field: [{ id: 'c_tier', value: 'VIP' }],
	});
	assert.deepEqual(single, { c_tier: 'VIP' });

	const multiple = buildCustomFieldsFilter({
		field: [
			{ id: ' c_tier ', value: 'VIP' },
			{ id: 'c_score', value: '100' },
			{ id: '', value: 'ignored' },
		],
	});
	assert.deepEqual(multiple, { c_tier: 'VIP', c_score: '100' });
});

test('parseCustomFilters parses JSON string and object', () => {
	assert.equal(parseCustomFilters(undefined), undefined);
	assert.equal(parseCustomFilters(''), undefined);
	assert.equal(parseCustomFilters('   '), undefined);
	assert.equal(parseCustomFilters('invalid json'), undefined);
	assert.equal(parseCustomFilters('123'), undefined);
	assert.equal(parseCustomFilters('[1, 2, 3]'), undefined);

	const fromString = parseCustomFilters('{"tag_ids": [10, 20], "custom_code": "XYZ"}');
	assert.deepEqual(fromString, { tag_ids: [10, 20], custom_code: 'XYZ' });

	const fromObject = parseCustomFilters({ tag_ids: [10, 20] });
	assert.deepEqual(fromObject, { tag_ids: [10, 20] });
});

test('composeFilter merges standard filters, custom fields, and custom JSON filters', () => {
	const standard = { name: 'Acme', status: 'active' };
	const filters = {
		customFieldsUi: {
			field: [{ id: 'c_vip', value: '1' }],
		},
		customFiltersJson: '{"tag_ids": [1, 2]}',
	};

	const composed = composeFilter(filters, standard);
	assert.deepEqual(composed, {
		name: 'Acme',
		status: 'active',
		custom_fields: { c_vip: '1' },
		tag_ids: [1, 2],
	});
});

test('Contact getAll sends custom_fields and custom JSON filter to /contacts/list', async () => {
	const ctx = fakeContext([ok([{ contact_id: 1, name: 'Acme' }])], {
		returnAll: false,
		limit: 10,
		options: {},
		filters: {
			name: 'Acme%',
			customFieldsUi: {
				field: [{ id: 'c_tier', value: 'Gold' }],
			},
			customFiltersJson: '{"tag_ids": [7, 8]}',
		},
	});

	const result = await contactHandler.call(ctx, 'getAll', 0);
	assert.equal(result.length, 1);
	assert.equal(ctx.calls.length, 1);
	const sentBody = ctx.calls[0].options.body;
	assert.deepEqual(sentBody.filter, {
		name: 'Acme%',
		custom_fields: { c_tier: 'Gold' },
		tag_ids: [7, 8],
	});
});

test('Project getAll sends custom_fields filter to /projects/list', async () => {
	const ctx = fakeContext([ok([{ project_id: 10, project_name: 'Launch' }])], {
		returnAll: false,
		limit: 10,
		options: {},
		filters: {
			status: 'in_progress',
			customFieldsUi: {
				field: [{ id: 'c_priority', value: 'High' }],
			},
		},
	});

	const result = await projectHandler.call(ctx, 'getAll', 0);
	assert.equal(result.length, 1);
	assert.equal(ctx.calls.length, 1);
	const sentBody = ctx.calls[0].options.body;
	assert.deepEqual(sentBody.filter, {
		status: 'in_progress',
		custom_fields: { c_priority: 'High' },
	});
});

test('Task getAll sends custom_fields and custom JSON filter to /tasks/list', async () => {
	const ctx = fakeContext([ok([{ event_id: 20, event_name: 'Design review' }])], {
		returnAll: false,
		limit: 10,
		options: {},
		filters: {
			isCompleted: false,
			customFieldsUi: {
				field: [{ id: 'c_sprint', value: 'Sprint 4' }],
			},
			customFiltersJson: '{"is_personal": 0}',
		},
	});

	const result = await taskHandler.call(ctx, 'getAll', 0);
	assert.equal(result.length, 1);
	assert.equal(ctx.calls.length, 1);
	const sentBody = ctx.calls[0].options.body;
	assert.deepEqual(sentBody.filter, {
		is_completed: 0,
		custom_fields: { c_sprint: 'Sprint 4' },
		is_personal: 0,
	});
});

test('Invoice getAll sends custom_fields filter to /invoices/list', async () => {
	const ctx = fakeContext([ok([{ invoice_id: 30, no: 'INV-100' }])], {
		returnAll: false,
		limit: 10,
		options: {},
		filters: {
			status: 'paid',
			customFieldsUi: {
				field: [{ id: 'c_exported_to_erp', value: '1' }],
			},
		},
	});

	const result = await invoiceHandler.call(ctx, 'getAll', 0);
	assert.equal(result.length, 1);
	assert.equal(ctx.calls.length, 1);
	const sentBody = ctx.calls[0].options.body;
	assert.deepEqual(sentBody.filter, {
		status: 'paid',
		custom_fields: { c_exported_to_erp: '1' },
	});
});

test('User getAll sends custom JSON filter to /users/list', async () => {
	const ctx = fakeContext([ok([{ user_id: 1, name: 'Alice' }])], {
		returnAll: false,
		limit: 10,
		options: {},
		filters: {
			status: 'active',
			customFiltersJson: '{"tag_ids": [99]}',
		},
	});

	const result = await userHandler.call(ctx, 'getAll', 0);
	assert.equal(result.length, 1);
	assert.equal(ctx.calls.length, 1);
	const sentBody = ctx.calls[0].options.body;
	assert.deepEqual(sentBody.filter, {
		status: 'active',
		tag_ids: [99],
	});
});
