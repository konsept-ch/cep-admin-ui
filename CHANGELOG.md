# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [archive-0.0.6] - 2025-10-31
### Fixed
- Ensure custom `responseHandler`s only run on successful responses, preserving error propagation and toast notifications from `prepareBaseQuery`.

## [archive-0.0.4] - 2025-10-28
### Fixed
- Corrected contract download filenames by decoding `Content-Disposition`, sanitising names, and deriving extensions from MIME types.

### Added
- Unit tests covering filename resolution and MIME-based extension fallbacks.

## [0.0.3] - 2025-10-28
### Fixed
- Restored contract download flow by making `prepareBaseQuery` respect binary responses, conditional JSON parsing and toast notification handling.

### Added
- Jest coverage validating blob downloads, JSON success payloads and error propagation within `prepareBaseQuery`.

## [0.0.2] - 2025-10-07
- Archive snapshot baseline (see tag `archive-0.0.2`).
