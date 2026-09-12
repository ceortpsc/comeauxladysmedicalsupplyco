# Security policy

## Never commit

- API keys, passwords, private keys or OAuth client secrets
- payment card data
- SSNs or identity-document images
- full regulator credential numbers in public source
- protected health information
- production database dumps

Use environment secrets and least-privilege service identities. Public release manifests must contain identifiers/checksums only, never customer, learner, payment or clinical secrets.

Report suspected vulnerabilities privately to the repository owner rather than opening a public issue with exploit details.
