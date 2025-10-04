# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Contact form component with US state selection
- Automatic US state code population feature
  - Auto-populates USPS two-letter state codes when user selects a state
  - Supports all 50 US states
  - Input validation and normalization (handles case-insensitive input, extra whitespace)
- Comprehensive test suite for state code utilities
  - Unit tests for state code mapping function
  - Integration tests for contact form component
  - Edge case handling tests
- Documentation for the state code auto-population feature

### Changed
- Updated main App component to include ContactForm
- Enhanced user interface with new contact form styling

## [1.0.0] - 2025-10-03

### Added
- Initial project setup with React frontend and Express backend
- Basic API endpoint for backend communication
- Deployment configuration for Heroku
