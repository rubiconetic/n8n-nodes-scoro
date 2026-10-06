# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Breaking Changes

- Complete rewrite for Scoro API v2 compliance and modern n8n community node standards.
- Replaced legacy node architecture with modern `@n8n/node-cli` (v0.50.5) tooling and ESLint 9 configuration.
- Replaced previous resources with Contact, Project, Task, Time Entry, Invoice and Quote, plus a generic `API Request`.
- Dropped legacy endpoints (Calendar, Client Profile, Comment, Role, Status, Trigger, User); all are accessible via `API Request`.
- Existing workflows using versions 0.2.x must be recreated. Existing saved credentials remain compatible.

### Added

- Full CRUD and search support for Contact, Project, Task, Time Entry, Invoice, and Quote resources.
- `API Request` resource allowing arbitrary Scoro API v2 calls with parameter validation and automatic pagination.
- Webhook trigger node (`Scoro Trigger`) with automatic subscribe and unsubscribe. It answers Scoro's URL check with HTTP 200; domain verification is still done by the site owner.
- On HTTP 429 the node waits for the time given in the x-ratelimit-reset header (1 to 10 seconds) and retries up to 5 times. It fails immediately when the daily limit is exhausted.
- Resource locators with dynamic search methods for contacts, projects, tasks, and users.
