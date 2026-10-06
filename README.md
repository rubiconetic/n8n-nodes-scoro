# n8n-nodes-scoro

n8n community node for interacting with the [Scoro API v2](https://api.scoro.com/api/v2).

> **Breaking Change Notice**: Version 1.0.0 is a breaking rewrite of 0.2.x. Resources and parameters have changed to ensure full Scoro API v2 compatibility. Saved credentials continue to work, but workflows built using the 0.2.x node must be rebuilt. Dropped resources from 0.2.x (Calendar, Client Profile, Comment, Role, Status, Trigger, User) can be called directly using the **API Request** resource.

---

## Installation

Install this community node package in your n8n instance:

1. Go to **Settings > Community Nodes** in your n8n instance.
2. Select **Install**.
3. Enter `n8n-nodes-scoro` as the package name.
4. Agree to the risks of installing community packages and click **Install**.

---

## Credentials

To authenticate with Scoro, create a **Scoro API** credential in n8n with:

- **Site URL**: Your Scoro domain or subdomain (e.g. `yourcompany` or `https://yourcompany.scoro.com`).
- **API Key**: Your Scoro API key.
- **Company Account ID**: Your Scoro company account ID.

You can find your API key and Company Account ID in Scoro under **Settings > External Connections > API**.

---

## Resources and Operations

| Resource        | Operations                                          |
| --------------- | --------------------------------------------------- |
| **Contact**     | Create, Delete, Get, Get Many, Update               |
| **Project**     | Create, Delete, Get, Get Many, Update               |
| **Task**        | Create, Delete, Get, Get Many, Update               |
| **Time Entry**  | Create, Delete, Get, Get Many, Set Done, Update     |
| **Invoice**     | Create, Delete, Generate PDF, Get, Get Many, Update |
| **Quote**       | Create, Delete, Generate PDF, Get, Get Many, Update |
| **API Request** | Send                                                |

_Note on Generate PDF_: For invoices and quotes, the **Generate PDF** operation asks Scoro to generate the PDF and returns Scoro's response containing the direct download URL (`pdf_link`), creation timestamp, and template ID.

_Note on Line Items_: When updating an invoice or quote with line items, Scoro replaces the entire line items collection. All lines to be kept must be included in the update request. Existing lines not included in the update payload will be deleted by Scoro.

---

## Get Many Operations

Every resource with a **Get Many** operation supports:

- **Return All / Limit**: Retrieve all matching records across pages or specify a maximum count.
- **Filters**: Filter records by date ranges, status, owner, project, or client. Text filters such as **Project Name** support `%` as a wildcard (e.g. `Acme%`).
- **Detailed Response**: Returns full record data. Scoro caps detailed responses at 25 records per request, which the node pages automatically.
- **Include Deleted**: Retrieve records deleted within the last 30 days.

---

## Custom Fields

Create and Update operations for Contact, Project, Task, Invoice, and Quote support custom fields. Specify the field ID exactly as configured in Scoro, including the `c_` prefix (e.g. `c_account_tier`).

---

## API Request

The **API Request** resource enables calling any Scoro API v2 endpoint directly:

- **Module**: The API module (e.g. `products`, `bills`, `expenses`, `users`).
- **Action**: One of `list`, `view`, `modify`, `delete`, or `other` (with a custom action name).
- **Record ID**: Optional ID for record-specific actions.
- **Request (JSON)**: Payload sent under the `request` key.
- **Filter (JSON)**: Filter object sent under the `filter` key for list operations.
- **Additional Body Parameters (JSON)**: Top-level parameters such as `detailed_response`.

### Example: List Products

- **Resource**: `API Request`
- **Module**: `products`
- **Action**: `list`
- **Request (JSON)**: `{}`
- **Filter (JSON)**: `{}`

---

## Scoro Trigger

The **Scoro Trigger** node starts a workflow when a record changes in Scoro. Activating the workflow subscribes a webhook in Scoro; deactivating it unsubscribes.

- **Module**: Bill, Calendar Event, Company, Expense, Invoice, Order, Person, Prepayment, Project, Purchase Order, Quote, Task.
- **Event**: Any Event, Record Created, Record Deleted, Record Modified.
- **Options**:
  - **Acting Users**: only fire when one of these users makes the change. Comma-separated user IDs, `any`, `me`, or `group_<ID>`.
  - **Owners**: only watch records belonging to these users. Same format.
  - **Relation Type**: how the owners relate to the record, for example `created_by`, `assigned_to`, `managed_by` or `owned_by`. Allowed values depend on the module.
  - **Watched Fields**: comma-separated field names. Modify events then only fire when one of these fields changes. Allowed values depend on the module.

### Domain verification

Scoro only accepts a webhook URL when the URL answers with HTTP 200 and its domain is verified. The trigger answers GET requests and empty POST requests with HTTP 200 without starting the workflow. It does not verify the domain for you. Do one of the following on the host of your n8n webhook URL:

1. **DNS TXT record**: add a TXT record on the exact webhook host whose value contains `scoro.txt`. This is the practical route for self-hosted n8n.
2. **Text file**: serve a plain text file at `https://<n8n-host>/scoro.txt`.

Scoro's help centre says it skips these checks for some pre-approved automation platforms and names n8n among them. Which hostnames that covers is not documented. See [Verifying webhook URLs for automations](https://support.scoro.com/hc/en-us/articles/47029859916941-Verifying-webhook-URLs-for-automations).

---

## Rate Limits

The Scoro API enforces per-second and daily request limits:

- When receiving an HTTP 429 ("Too Many Requests") response, the node reads the `x-ratelimit-reset` header and automatically waits and retries up to 5 times.
- If the daily request limit is exhausted (`x-daily-requests-remaining` is 0), the node halts execution immediately with an explicit error.

---

## Development

```bash
# Install dependencies
npm install

# Check code formatting and linting
npm run lint

# Run automated tests
npm test

# Start a local n8n with this node loaded (needs Docker or Podman)
npm run dev

# Rebuild on change
npm run build:watch
```

---

## License

[MIT](LICENSE.md)
