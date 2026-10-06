# n8n-nodes-scoro 🚀

This is an n8n community node. It lets you use **[Scoro](https://www.scoro.com/)** in your n8n workflows.

> Scoro is an end-to-end work management software designed for service-based businesses like consultancies, agencies, and IT firms. The cloud-based platform integrates projects, resources, sales, and finances into a single system, eliminating the need to switch between different applications.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation-) • [Operations](#operations-) • [Credentials](#credentials-) • [Compatibility](#compatibility-) • [Resources](#resources-) • [Version history](#version-history-)

> ⚠️ **Breaking Change Notice**: Version 1.0.0 is a complete rewrite targeting full Scoro API v2 compatibility. Existing saved credentials remain compatible, but workflows built using the 0.2.x node must be recreated. Endpoints from 0.2.x not covered as core resources (Calendar, Client Profile, Comment, Role, Status, User) can be called directly using the **API Request** resource.

---

## Installation 💾

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation:

1. Go to **Settings > Community Nodes** in your n8n instance.
2. Select **Install**.
3. Enter `n8n-nodes-scoro` as the package name.
4. Agree to the risks of installing community packages and click **Install**.

---

## Operations ✨

The **Scoro** node supports operations across core business resources, plus a generic API Request resource:

| Resource | Create | Delete | Get | Get Many | Update | Set Done | Generate PDF | Send |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Contact** | ✅ | ✅ | ✅ | ✅ | ✅ | | | |
| **Project** | ✅ | ✅ | ✅ | ✅ | ✅ | | | |
| **Task** | ✅ | ✅ | ✅ | ✅ | ✅ | | | |
| **Time Entry** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | | |
| **Invoice** | ✅ | ✅ | ✅ | ✅ | ✅ | | ✅ | |
| **Quote** | ✅ | ✅ | ✅ | ✅ | ✅ | | ✅ | |
| **API Request** | | | | | | | | ✅ |

### Operation Notes

- **Generate PDF**: For Invoices and Quotes, the **Generate PDF** operation returns Scoro's response containing the direct download URL (`pdf_link`), creation timestamp, and template ID.
- **Line Items Replacement**: When updating an Invoice or Quote with line items, Scoro replaces the entire line items collection. All lines to be kept must be included in the update request; any omitted lines will be deleted by Scoro.
- **Custom Fields**: Create and Update operations support custom fields. Specify the field ID exactly as configured in Scoro, including the `c_` prefix (e.g. `c_account_tier`).

### Get Many Options

Every resource with a **Get Many** operation supports:

- **Return All / Limit**: Retrieve all matching records across pages or specify a maximum count.
- **Filters**: Filter records by date ranges, status, owner, project, or client. Text filters support `%` as a wildcard (e.g. `Acme%`).
- **Detailed Response**: Returns full record data. Scoro caps detailed responses at 25 records per request, which the node automatically pages.
- **Include Deleted**: Retrieve records deleted within the last 30 days.

---

## API Request 🛠️

The **API Request** resource enables calling any Scoro API v2 endpoint directly:

- **Module**: The API module (e.g. `products`, `bills`, `expenses`, `users`).
- **Action**: One of `list`, `view`, `modify`, `delete`, or `other` (with a custom action name).
- **Record ID**: Optional ID for record-specific actions.
- **Request (JSON)**: Payload sent under the `request` key.
- **Filter (JSON)**: Filter object sent under the `filter` key for list operations.
- **Additional Body Parameters (JSON)**: Top-level parameters such as `detailed_response`.

---

## Scoro Trigger ⚡

The **Scoro Trigger** node starts a workflow when a record changes in Scoro. Activating the workflow subscribes a webhook in Scoro; deactivating it unsubscribes.

- **Supported Modules**: Bill, Calendar Event, Company, Expense, Invoice, Order, Person, Prepayment, Project, Purchase Order, Quote, Task.
- **Events**: Any Event, Record Created, Record Deleted, Record Modified.
- **Options**:
  - **Acting Users**: Filter by user IDs, `any`, `me`, or `group_<ID>`.
  - **Owners**: Only watch records belonging to these users.
  - **Relation Type**: Relationship of owner to record (`created_by`, `assigned_to`, `managed_by`, `owned_by`).
  - **Watched Fields**: Comma-separated field names to watch for modification events.

### Domain Verification

Scoro only activates webhooks when the URL answers with HTTP 200 and its domain is verified:
1. The trigger node automatically answers Scoro's initial handshake requests with HTTP 200.
2. Complete domain verification by adding a DNS TXT record containing `scoro.txt` on your n8n host, or by serving a text file at `https://<n8n-host>/scoro.txt`. See [Verifying webhook URLs for automations](https://support.scoro.com/hc/en-us/articles/47029859916941-Verifying-webhook-URLs-for-automations).

---

## Credentials 🔑

To use the Scoro node, you need:

1. A Scoro account at [https://www.scoro.com/](https://www.scoro.com/).
2. Your API key and Company Account ID from **Settings > External Connections > API**.
3. In n8n, create a **Scoro API** credential with:
   - **Site URL**: Your Scoro domain or subdomain (e.g. `yourcompany` or `https://yourcompany.scoro.com`).
   - **API Key**: Your Scoro API key.
   - **Company Account ID**: Your Scoro company account ID.

The node authenticates by sending these credentials in the request body of Scoro API v2 calls.

> ⚠️ Do not share your API key or other sensitive information with anyone who does not have permission to access it. Keep them secure! 🔒

---

## Rate Limits ⏱️

The Scoro API enforces per-second and daily request limits:

- On HTTP 429 ("Too Many Requests"), the node reads the `x-ratelimit-reset` header and automatically waits and retries up to 5 times.
- If the daily request limit is exhausted (`x-daily-requests-remaining` is 0), the node halts execution immediately with an explicit error.

---

## Compatibility 📦

- Minimum n8n version: `1.0.0`
- Tested against n8n versions: `1.0.0+`
- Node.js version: `20` or higher

---

## Development 💻

```bash
# Install dependencies
npm install

# Check code formatting and linting
npm run lint

# Run automated tests
npm test

# Start a local n8n with this node loaded
npm run dev

# Rebuild on change
npm run build:watch
```

---

## Resources 📚

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Official Scoro API documentation](https://api.scoro.com/api/v2)

---

## Version history 📜

- **Version 1.0.0**: Complete rewrite for Scoro API v2 compliance, modern `@n8n/node-cli` tooling, Contact, Project, Task, Time Entry, Invoice, Quote, API Request, Scoro Trigger, rate limit handling, and adaptive light/dark branding.
- **Version 0.2.1**: Updated README to reflect the `Comment` resource update.
- **Version 0.2.0**: Added the `Comment` resource with create, get many, update, and delete operations.
- **Version 0.1.0**: Initial release of the community node.

---

## License 📄

[MIT](LICENSE.md)
