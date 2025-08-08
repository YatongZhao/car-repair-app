# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Car Repair Shop Quote Application - a pure frontend React application for automotive repair shops to generate professional quotes for their services. The app operates entirely in the browser with no backend dependencies, storing all data in IndexedDB for offline operation.

## Architecture Overview

### Technology Stack
- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **State Management**: Redux Toolkit with TypeScript
- **Styling**: Native CSS with CSS modules and responsive design
- **Data Storage**: IndexedDB for persistent storage (no localStorage)
- **Type Checking**: TypeScript for type safety and better DX
- **Build Target**: Pure frontend application for static hosting
- **Browser Support**: Modern browsers (Chrome 70+, Firefox 65+, Safari 12+)

### Core Application Structure

```
src/
├── components/              # Reusable UI components
│   ├── Button/
│   ├── Input/
│   ├── Modal/
│   ├── ServiceManager/      # Service configuration management
│   └── CustomerFieldManager/ # Custom customer field management
├── containers/              # Page-level container components
│   ├── CustomerInfoForm/
│   ├── ServiceSelection/
│   └── QuoteDisplay/
├── store/                   # Redux Toolkit state management
│   ├── slices/             # RTK slices with TypeScript
│   ├── hooks.ts            # Typed Redux hooks
│   └── index.ts            # Store configuration
├── utils/                   # Core utilities
│   ├── indexedDB.ts        # IndexedDB operations and data persistence
│   ├── dataExport.ts       # Import/export functionality
│   ├── validation.ts       # Input validation utilities
│   └── browserSupport.ts   # Browser compatibility checks
├── types/                   # TypeScript type definitions
│   ├── customer.ts         # Customer data types
│   ├── service.ts          # Service data types
│   └── common.ts           # Common/shared types
├── constants/              # Application constants
├── styles/                 # Global styles and themes
└── data/                   # Default configuration data
    ├── defaultServices.ts     # Preset service catalog
    └── defaultCustomerFields.ts # Default customer form fields
```

## Key Features & Data Models

### Customer Information Management
- **Basic Fields**: name, phone, carModel, carYear, licensePlate
- **Custom Fields**: User-configurable additional fields with types (text, number, date, email, tel)
- **Field Configuration**: Stored in IndexedDB with ordering, validation rules, and display preferences

### Service Management System
- **Service Categories**: Organized hierarchical structure (engine, brake, transmission, etc.)
- **Service Items**: Individual services with pricing within each category
- **User Customization**: Full CRUD operations for categories and items
- **Data Persistence**: All modifications saved to IndexedDB with version control

### Quote Generation
- **Real-time Calculation**: Dynamic price totals as services are added/removed
- **Professional Output**: Formatted quote display with customer info and service breakdown
- **Print Functionality**: Browser-native printing with print-optimized CSS

## Redux State Structure

```javascript
{
  customer: {
    // Basic customer information
    name, phone, carModel, carYear, licensePlate,
    customFields: {}  // Dynamic user-defined fields
  },
  customerConfig: {
    customFields: [], // Field definitions
    fieldOrder: []    // Display order
  },
  services: {
    selectedServices: [],  // Current quote services
    serviceDatabase: {},   // Runtime service catalog
    totalAmount: 0
  },
  serviceConfig: {
    // Service management state
  },
  ui: {
    currentStep: 'input', // 'input' | 'review' | 'print'
    showServiceManager: false,
    showCustomerFieldManager: false
  }
}
```

## Data Persistence Strategy

### IndexedDB Implementation
- **Primary Storage**: All user configurations and service data stored in IndexedDB
- **Database Name**: `CarRepairApp`
- **Object Stores**: 
  - `serviceDatabase` - Service categories and items
  - `customerFieldConfig` - Custom field definitions
  - `userPreferences` - Application preferences
  - `backupData` - Configuration backups

### Critical Browser Support
- **IndexedDB Detection**: App checks for IndexedDB support on startup
- **Fallback Strategy**: If unsupported, app displays error message and disables functionality
- **No localStorage**: Application specifically avoids localStorage per requirements

## Development Guidelines

### Component Development
- Use functional components with React Hooks and TypeScript
- Implement React.memo for performance optimization
- Follow single responsibility principle for component design
- Use TypeScript interfaces and types for comprehensive type checking
- Define proper component props interfaces

### State Management
- Use Redux Toolkit with TypeScript for state management
- Define typed slices with createSlice from RTK
- Use typed hooks (useAppSelector, useAppDispatch)
- Keep business logic in Redux, UI logic in components
- Define proper TypeScript interfaces for all state shapes

### Styling Approach
- Native CSS with CSS modules for component-specific styles
- Responsive design with mobile-first approach
- Consistent design system with defined color palette and typography
- Print-specific CSS for quote output

### Performance Requirements
- Bundle size < 500KB (gzipped)
- First screen load < 3 seconds
- User interaction response < 500ms
- Memory usage < 50MB

## Key User Flows

1. **Standard Quote Creation**:
   - Fill customer information (optional fields)
   - Select service categories and items
   - Add services to quote
   - Review total and generate quote
   - Print or start new quote

2. **Service Management**:
   - Access service manager from header
   - Edit existing services or add new categories/items
   - Import/export service configurations
   - Reset to default settings

3. **Custom Field Management**:
   - Configure additional customer information fields
   - Set field types, validation, and display order
   - Fields automatically appear in customer form

## Technical Constraints

- **No Backend**: Pure frontend implementation only
- **No User Authentication**: Single-user application per browser
- **No External APIs**: All functionality must work offline
- **IndexedDB Required**: Application cannot function without IndexedDB support
- **Static Deployment**: Must be deployable to any static web server

## Testing & Quality Assurance

- Functional testing for all React components
- Redux state management testing
- Cross-browser compatibility testing
- IndexedDB functionality testing
- Responsive design testing across devices
- Print functionality verification

## Localization

- **Language**: Chinese (Simplified) as primary language
- **Currency**: Chinese Yuan (¥) formatting
- **Input Validation**: Support for Chinese characters and formats
- **Error Messages**: All user-facing text in Chinese