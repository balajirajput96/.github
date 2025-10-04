# .github

*Community health files for the [@GitHub](https://github.com/github) organization*

For more information, please see the article on [creating a default community health file for your organization](https://help.github.com/en/articles/creating-a-default-community-health-file-for-your-organization).

## Web Application

This repository also contains a web application with a React frontend and Express backend.

### Features

#### US State Code Auto-Population for Contact Forms

The contact form automatically populates USPS state codes when users select a state:

- **Automatic State Code Population**: When a user selects a state from the dropdown, the corresponding two-letter USPS state code is automatically filled in
- **All 50 US States Supported**: Complete coverage of all US states and their official USPS codes
- **Input Validation**: Handles various input formats (case-insensitive, extra whitespace)
- **User-Friendly Interface**: Clean, modern form design with clear labels and validation

**Example Usage:**
1. User selects "California" from the state dropdown
2. State code field automatically populates with "CA"
3. State code field is read-only to prevent manual edits

**Technical Implementation:**
- State code mapping utility with comprehensive test coverage
- React hooks for automatic state synchronization
- Input normalization for robust handling of edge cases

### Getting Started

#### Prerequisites
- Node.js (v14 or higher)
- npm

#### Installation

1. Clone the repository
2. Install server dependencies:
   ```bash
   cd web-app/server
   npm install
   ```
3. Install client dependencies:
   ```bash
   cd web-app/client
   npm install
   ```

#### Running the Application

**Development Mode:**
```bash
# Terminal 1 - Run the server
cd web-app/server
npm start

# Terminal 2 - Run the client
cd web-app/client
npm start
```

The application will open at `http://localhost:3000` with the backend API at `http://localhost:3001`.

**Production Build:**
```bash
# Build the React app
cd web-app/client
npm run build

# Start the server (serves the built React app)
cd ../server
npm start
```

#### Running Tests

```bash
cd web-app/client
npm test
```

### Project Structure

```
web-app/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── ContactForm.js
│   │   │   └── ContactForm.css
│   │   ├── utils/        # Utility functions
│   │   │   └── stateCodes.js
│   │   └── App.js        # Main app component
│   └── package.json
└── server/               # Express backend
    ├── index.js
    └── package.json
```

### Documentation

- [CHANGELOG.md](CHANGELOG.md) - Version history and release notes
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) - Community guidelines
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [SECURITY.md](SECURITY.md) - Security policy
