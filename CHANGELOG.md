# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.0.3] - 2025-10-28
### Fixed
- Restored contract download flow by making `prepareBaseQuery` respect binary responses, conditional JSON parsing and toast notification handling.

### Added
- Jest coverage validating blob downloads, JSON success payloads and error propagation within `prepareBaseQuery`.

## [0.0.2] - 2025-10-07
- Archive snapshot baseline (see tag `archive-0.0.2`).