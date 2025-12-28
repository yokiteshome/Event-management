# Software Requirements Specification (SRS)
## EventHub - Event Management Platform

**Version:** 1.0  
**Date:** 2024  
**Document Status:** Final

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [System Features](#3-system-features)
4. [External Interface Requirements](#4-external-interface-requirements)
5. [System Requirements](#5-system-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [User Stories](#7-user-stories)
8. [Use Cases](#8-use-cases)
9. [Data Models](#9-data-models)
10. [Security Requirements](#10-security-requirements)
11. [Future Enhancements](#11-future-enhancements)

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) document provides a comprehensive description of the EventHub Event Management Platform. It details the functional and non-functional requirements, system features, and design constraints for the platform.

### 1.2 Scope
EventHub is a web-based event management system that enables:
- Event hosting companies to register and manage events
- Administrators to approve and manage event owners
- Event owners to create, manage events and approve attendees
- Public users to register for events and receive QR codes for check-in
- QR code-based event check-in system

### 1.3 Definitions, Acronyms, and Abbreviations
- **SRS**: Software Requirements Specification
- **API**: Application Programming Interface
- **JWT**: JSON Web Token
- **QR Code**: Quick Response Code
- **ODM**: Object Document Mapper
- **SaaS**: Software as a Service
- **UI**: User Interface
- **UX**: User Experience

### 1.4 References
- Next.js Documentation: https://nextjs.org/docs
- MongoDB Documentation: https://docs.mongodb.com
- React Documentation: https://react.dev
- IEEE 830-1998 Standard for Software Requirements Specifications

### 1.5 Overview
This document is organized into sections covering system overview, functional requirements, non-functional requirements, user stories, use cases, and data models.

---

## 2. Overall Description

### 2.1 Product Perspective
EventHub is a standalone web application built as a SaaS platform. It operates independently and provides event management capabilities through a web interface accessible via modern browsers.

### 2.2 Product Functions
The system provides the following main functions:
1. **User Authentication & Authorization**
   - Admin login
   - Event owner registration and login
   - Role-based access control

2. **Event Owner Management**
   - Company registration with document upload
   - Admin approval workflow
   - Owner profile management

3. **Event Management**
   - Event creation and editing
   - Event listing and search
   - Event details management

4. **Attendee Management**
   - Public event registration
   - Owner approval workflow
   - Attendee status tracking

5. **QR Code System**
   - QR code generation for approved attendees
   - QR code scanning for check-in
   - Check-in status tracking

6. **Analytics & Reporting**
   - Dashboard statistics
   - Event analytics
   - Revenue tracking
   - Attendance metrics

7. **Notification System**
   - Real-time notifications
   - Notification management

### 2.3 User Classes and Characteristics

#### 2.3.1 Administrator
- **Role**: System administrator
- **Responsibilities**: 
  - Approve/reject event owner registrations
  - Monitor platform activities
  - View system-wide analytics
  - Manage all events and owners
- **Access Level**: Full system access

#### 2.3.2 Event Owner
- **Role**: Event hosting company representative
- **Responsibilities**:
  - Register company account
  - Create and manage events
  - Approve/reject attendee registrations
  - View event analytics
- **Access Level**: Limited to own events and attendees

#### 2.3.3 Attendee
- **Role**: Event participant
- **Responsibilities**:
  - Register for events
  - View QR code for approved registrations
  - Present QR code at event check-in
- **Access Level**: Public access to registration, limited access to personal QR codes

### 2.4 Operating Environment
- **Client**: Modern web browsers (Chrome, Firefox, Safari, Edge)
- **Server**: Node.js runtime environment
- **Database**: MongoDB (local or cloud-based)
- **Deployment**: Cloud or on-premises server

### 2.5 Design and Implementation Constraints
- Built using Next.js 16 (App Router)
- React 19 for UI components
- TypeScript for type safety
- MongoDB with Mongoose ODM
- JWT for authentication
- Responsive design required
- Must support mobile devices

### 2.6 Assumptions and Dependencies
- Users have access to modern web browsers
- MongoDB database is available and accessible
- Internet connectivity is available
- Users have JavaScript enabled
- QR code scanning requires device camera access

---

## 3. System Features

### 3.1 Authentication & Authorization

#### 3.1.1 Admin Login
- **Priority**: High
- **Description**: Administrators can log in using credentials
- **Inputs**: Email, Password
- **Processing**: 
  - Validate credentials
  - Generate JWT token
  - Set authentication cookie
- **Outputs**: Redirect to admin dashboard

#### 3.1.2 Event Owner Registration
- **Priority**: High
- **Description**: Event hosting companies can register for platform access
- **Inputs**: 
  - Company name (required)
  - Owner full name (optional)
  - Email (required, unique)
  - Phone number (optional)
  - Password (required, min 6 characters)
  - Company document (optional, file upload)
- **Processing**:
  - Validate input data
  - Check email uniqueness
  - Hash password
  - Store owner with PENDING status
  - Notify admin of new registration
- **Outputs**: Registration confirmation message

#### 3.1.3 Event Owner Login
- **Priority**: High
- **Description**: Approved event owners can log in
- **Inputs**: Email, Password
- **Processing**:
  - Validate credentials
  - Check owner approval status
  - Generate JWT token
  - Set authentication cookie
- **Outputs**: Redirect to owner dashboard

#### 3.1.4 Logout
- **Priority**: Medium
- **Description**: Users can log out from the system
- **Processing**: Clear authentication cookie
- **Outputs**: Redirect to login page

### 3.2 Admin Dashboard

#### 3.2.1 Owner Approval Management
- **Priority**: High
- **Description**: Admins can view and approve/reject event owner registrations
- **Inputs**: Owner ID, Approval status (APPROVED/REJECTED)
- **Processing**:
  - Update owner status
  - Create notification for owner
- **Outputs**: Updated owner list

#### 3.2.2 Owner Management
- **Priority**: High
- **Description**: Admins can view all registered owners
- **Outputs**: List of all owners with status, company details

#### 3.2.3 Event Management
- **Priority**: Medium
- **Description**: Admins can view all events across the platform
- **Outputs**: List of all events with details

#### 3.2.4 Analytics Dashboard
- **Priority**: Medium
- **Description**: Admins can view platform-wide analytics
- **Outputs**: 
  - Total owners
  - Total events
  - Total attendees
  - Revenue metrics
  - Activity statistics

### 3.3 Event Owner Dashboard

#### 3.3.1 Dashboard Overview
- **Priority**: High
- **Description**: Event owners can view summary statistics
- **Outputs**:
  - Total events
  - Total attendees
  - Pending approvals
  - Revenue metrics

#### 3.3.2 Event Creation
- **Priority**: High
- **Description**: Event owners can create new events
- **Inputs**:
  - Event name (required, min 3 characters)
  - Description (optional)
  - Date (required)
  - Start date (optional)
  - End date (optional)
  - Location (required, min 3 characters)
  - Capacity (optional, default 1000)
  - Banner image (optional, base64 encoded)
- **Processing**:
  - Validate input data
  - Create event record
  - Associate with owner
- **Outputs**: Event creation confirmation

#### 3.3.3 Event Management
- **Priority**: High
- **Description**: Event owners can view and manage their events
- **Outputs**: List of owner's events with details

#### 3.3.4 Attendee Management
- **Priority**: High
- **Description**: Event owners can view and approve/reject attendee registrations
- **Inputs**: Attendee ID, Approval status (APPROVED/REJECTED)
- **Processing**:
  - Update attendee status
  - Generate QR code for approved attendees
- **Outputs**: Updated attendee list

#### 3.3.5 Ticket Management
- **Priority**: Medium
- **Description**: Event owners can view ticket sales and statistics
- **Outputs**: 
  - Ticket sales list
  - Revenue statistics
  - Ticket type distribution

#### 3.3.6 Analytics
- **Priority**: Medium
- **Description**: Event owners can view analytics for their events
- **Outputs**:
  - Event performance metrics
  - Attendance statistics
  - Revenue analytics
  - Conversion rates

### 3.4 Public Event Registration

#### 3.4.1 Event Discovery
- **Priority**: High
- **Description**: Public users can browse available events
- **Outputs**: List of public events

#### 3.4.2 Event Registration
- **Priority**: High
- **Description**: Public users can register for events
- **Inputs**:
  - Name (required, min 2 characters)
  - Email (required, valid email format)
  - Phone (optional)
  - Notes (optional)
  - Event ID (required)
- **Processing**:
  - Validate input data
  - Check for duplicate registration
  - Create attendee record with PENDING status
  - Notify event owner
- **Outputs**: Registration confirmation message

### 3.5 QR Code System

#### 3.5.1 QR Code Generation
- **Priority**: High
- **Description**: System generates QR codes for approved attendees
- **Inputs**: Attendee ID
- **Processing**: Generate QR code containing attendee ID
- **Outputs**: QR code image/component

#### 3.5.2 QR Code Display
- **Priority**: High
- **Description**: Approved attendees can view their QR code
- **Outputs**: QR code page with attendee details

#### 3.5.3 QR Code Scanning
- **Priority**: Medium
- **Description**: Event staff can scan QR codes for check-in
- **Inputs**: QR code data (attendee ID)
- **Processing**:
  - Decode QR code
  - Validate attendee
  - Update check-in status
- **Outputs**: Check-in confirmation

### 3.6 Notification System

#### 3.6.1 Notification Generation
- **Priority**: Medium
- **Description**: System generates notifications for various events
- **Types**:
  - OWNER_REGISTRATION: Admin notified of new owner registration
  - OWNER_APPROVED: Owner notified of approval
  - OWNER_REJECTED: Owner notified of rejection
  - NEW_ATTENDEE: Owner notified of new attendee registration

#### 3.6.2 Notification Display
- **Priority**: Medium
- **Description**: Users can view their notifications
- **Outputs**: Notification list with unread count

#### 3.6.3 Notification Management
- **Priority**: Low
- **Description**: Users can mark notifications as read
- **Inputs**: Notification ID or mark all as read
- **Processing**: Update notification read status
- **Outputs**: Updated notification list

---

## 4. External Interface Requirements

### 4.1 User Interfaces
- **Web Interface**: Responsive web application
- **Design**: Modern, clean UI with Tailwind CSS
- **Components**: 
  - Navigation bars
  - Forms
  - Tables
  - Cards
  - Modals
  - QR code displays
- **Responsive Breakpoints**: Mobile, Tablet, Desktop

### 4.2 Hardware Interfaces
- **Client Devices**: Desktop computers, tablets, smartphones
- **Camera**: Required for QR code scanning functionality
- **Display**: Minimum 320px width for mobile devices

### 4.3 Software Interfaces
- **Database**: MongoDB (local or MongoDB Atlas)
- **Authentication**: JWT-based authentication
- **File Storage**: Base64 encoding for document/images (in-database storage)

### 4.4 Communication Interfaces
- **Protocol**: HTTP/HTTPS
- **API Format**: RESTful API
- **Data Format**: JSON
- **Authentication**: Cookie-based JWT tokens

---

## 5. System Requirements

### 5.1 Functional Requirements

#### FR1: User Authentication
- **FR1.1**: System shall allow administrators to log in with credentials
- **FR1.2**: System shall allow event owners to register new accounts
- **FR1.3**: System shall allow approved event owners to log in
- **FR1.4**: System shall validate user credentials before granting access
- **FR1.5**: System shall maintain user sessions using JWT tokens
- **FR1.6**: System shall enforce role-based access control

#### FR2: Event Owner Management
- **FR2.1**: System shall allow companies to register with company details
- **FR2.2**: System shall store owner registrations with PENDING status
- **FR2.3**: System shall notify administrators of new owner registrations
- **FR2.4**: System shall allow administrators to approve or reject owners
- **FR2.5**: System shall notify owners of approval/rejection status
- **FR2.6**: System shall prevent rejected owners from logging in

#### FR3: Event Management
- **FR3.1**: System shall allow approved owners to create events
- **FR3.2**: System shall validate event data before creation
- **FR3.3**: System shall associate events with their owners
- **FR3.4**: System shall allow owners to view their events
- **FR3.5**: System shall display events to public users
- **FR3.6**: System shall support event details (name, date, location, capacity)

#### FR4: Attendee Management
- **FR4.1**: System shall allow public users to register for events
- **FR4.2**: System shall prevent duplicate registrations (same email, same event)
- **FR4.3**: System shall store attendee registrations with PENDING status
- **FR4.4**: System shall notify event owners of new attendee registrations
- **FR4.5**: System shall allow owners to approve or reject attendees
- **FR4.6**: System shall generate QR codes for approved attendees

#### FR5: QR Code System
- **FR5.1**: System shall generate unique QR codes for approved attendees
- **FR5.2**: System shall display QR codes to approved attendees
- **FR5.3**: System shall allow QR code scanning for check-in
- **FR5.4**: System shall track check-in status and time

#### FR6: Analytics & Reporting
- **FR6.1**: System shall provide dashboard statistics for owners
- **FR6.2**: System shall provide platform-wide analytics for admins
- **FR6.3**: System shall track event metrics (attendees, revenue, etc.)
- **FR6.4**: System shall calculate conversion rates

#### FR7: Notification System
- **FR7.1**: System shall generate notifications for key events
- **FR7.2**: System shall display notifications to users
- **FR7.3**: System shall track notification read status
- **FR7.4**: System shall allow users to mark notifications as read

### 5.2 Non-Functional Requirements

#### NFR1: Performance
- **NFR1.1**: System shall respond to user requests within 2 seconds
- **NFR1.2**: System shall support concurrent users (minimum 100)
- **NFR1.3**: System shall handle database queries efficiently

#### NFR2: Security
- **NFR2.1**: System shall hash passwords using bcrypt
- **NFR2.2**: System shall use JWT tokens for authentication
- **NFR2.3**: System shall validate all user inputs
- **NFR2.4**: System shall enforce role-based access control
- **NFR2.5**: System shall protect against SQL injection (N/A - NoSQL)
- **NFR2.6**: System shall protect against XSS attacks

#### NFR3: Usability
- **NFR3.1**: System shall provide intuitive user interface
- **NFR3.2**: System shall be responsive across devices
- **NFR3.3**: System shall provide clear error messages
- **NFR3.4**: System shall support keyboard navigation

#### NFR4: Reliability
- **NFR4.1**: System shall handle errors gracefully
- **NFR4.2**: System shall provide appropriate error messages
- **NFR4.3**: System shall maintain data integrity

#### NFR5: Maintainability
- **NFR5.1**: System shall be built with TypeScript for type safety
- **NFR5.2**: System shall follow consistent code structure
- **NFR5.3**: System shall include validation schemas

#### NFR6: Scalability
- **NFR6.1**: System architecture shall support horizontal scaling
- **NFR6.2**: Database design shall support growth

---

## 6. Non-Functional Requirements

### 6.1 Performance Requirements
- Page load time: < 2 seconds
- API response time: < 1 second
- Support for 100+ concurrent users
- Database query optimization

### 6.2 Security Requirements
- Password hashing with bcrypt (10 rounds)
- JWT token expiration (7 days)
- Input validation on all forms
- Role-based access control
- Secure cookie handling
- Protection against common web vulnerabilities

### 6.3 Usability Requirements
- Responsive design (mobile, tablet, desktop)
- Intuitive navigation
- Clear error messages
- Accessible UI components
- Consistent design language

### 6.4 Reliability Requirements
- Error handling and logging
- Data validation
- Transaction integrity
- Graceful degradation

### 6.5 Portability Requirements
- Cross-browser compatibility
- Mobile device support
- Cloud deployment ready

---

## 7. User Stories

### 7.1 Administrator Stories
- **US-ADM-001**: As an administrator, I want to log in to the system so that I can manage the platform
- **US-ADM-002**: As an administrator, I want to view pending owner registrations so that I can review them
- **US-ADM-003**: As an administrator, I want to approve owner registrations so that companies can use the platform
- **US-ADM-004**: As an administrator, I want to reject owner registrations so that I can maintain platform quality
- **US-ADM-005**: As an administrator, I want to view all events so that I can monitor platform activity
- **US-ADM-006**: As an administrator, I want to view platform analytics so that I can understand usage

### 7.2 Event Owner Stories
- **US-OWN-001**: As an event owner, I want to register my company so that I can use the platform
- **US-OWN-002**: As an event owner, I want to log in after approval so that I can manage my events
- **US-OWN-003**: As an event owner, I want to create events so that people can register
- **US-OWN-004**: As an event owner, I want to view my events so that I can manage them
- **US-OWN-005**: As an event owner, I want to approve attendees so that they can attend my events
- **US-OWN-006**: As an event owner, I want to reject attendees so that I can control event capacity
- **US-OWN-007**: As an event owner, I want to view analytics so that I can understand event performance
- **US-OWN-008**: As an event owner, I want to receive notifications so that I know about new registrations

### 7.3 Attendee Stories
- **US-ATT-001**: As an attendee, I want to browse available events so that I can find events to attend
- **US-ATT-002**: As an attendee, I want to register for events so that I can attend them
- **US-ATT-003**: As an attendee, I want to view my QR code so that I can check in at the event
- **US-ATT-004**: As an attendee, I want to know my registration status so that I know if I'm approved

---

## 8. Use Cases

### UC1: Event Owner Registration
**Actor**: Event Owner  
**Preconditions**: None  
**Main Flow**:
1. Event owner navigates to registration page
2. Event owner fills registration form (company name, email, password, etc.)
3. System validates input
4. System checks email uniqueness
5. System hashes password
6. System creates owner record with PENDING status
7. System notifies admin
8. System displays success message

**Alternative Flows**:
- 3a. Invalid input: System displays error message
- 4a. Email exists: System displays error message

**Postconditions**: Owner record created, admin notified

### UC2: Admin Approves Owner
**Actor**: Administrator  
**Preconditions**: Admin logged in, pending owner exists  
**Main Flow**:
1. Admin views pending owners
2. Admin selects owner to approve
3. Admin clicks approve
4. System updates owner status to APPROVED
5. System creates notification for owner
6. System updates display

**Postconditions**: Owner status APPROVED, owner can log in

### UC3: Create Event
**Actor**: Event Owner  
**Preconditions**: Owner logged in and approved  
**Main Flow**:
1. Owner navigates to create event page
2. Owner fills event form (name, date, location, capacity, etc.)
3. System validates input
4. System creates event record
5. System associates event with owner
6. System displays success message

**Alternative Flows**:
- 3a. Invalid input: System displays error message

**Postconditions**: Event created and associated with owner

### UC4: Attendee Registration
**Actor**: Attendee  
**Preconditions**: Public event exists  
**Main Flow**:
1. Attendee navigates to event registration page
2. Attendee fills registration form (name, email, etc.)
3. System validates input
4. System checks for duplicate registration
5. System creates attendee record with PENDING status
6. System notifies event owner
7. System displays success message

**Alternative Flows**:
- 3a. Invalid input: System displays error message
- 4a. Duplicate registration: System displays error message

**Postconditions**: Attendee record created, owner notified

### UC5: Owner Approves Attendee
**Actor**: Event Owner  
**Preconditions**: Owner logged in, pending attendee exists  
**Main Flow**:
1. Owner views pending attendees
2. Owner selects attendee to approve
3. Owner clicks approve
4. System updates attendee status to APPROVED
5. System enables QR code generation for attendee
6. System updates display

**Postconditions**: Attendee status APPROVED, QR code available

### UC6: View QR Code
**Actor**: Attendee  
**Preconditions**: Attendee approved for event  
**Main Flow**:
1. Attendee navigates to QR code page
2. System retrieves attendee information
3. System generates QR code
4. System displays QR code and attendee details

**Postconditions**: QR code displayed

---

## 9. Data Models

### 9.1 EventOwner Model
```typescript
{
  companyName: string (required)
  ownerFullName: string (optional)
  email: string (required, unique)
  phoneNumber: string (optional)
  passwordHash: string (required)
  logoUrl: string (optional)
  companyDocument: string (optional, base64)
  status: 'PENDING' | 'APPROVED' | 'REJECTED' (default: 'PENDING')
  createdAt: Date
  updatedAt: Date
}
```

### 9.2 Event Model
```typescript
{
  name: string (required)
  description: string (optional)
  date: Date (required)
  startDate: Date (optional)
  endDate: Date (optional)
  location: string (required)
  capacity: number (required, default: 1000)
  bannerImage: string (optional, base64)
  ownerId: ObjectId (required, ref: EventOwner)
  createdAt: Date
  updatedAt: Date
}
```

### 9.3 Attendee Model
```typescript
{
  name: string (required)
  email: string (required)
  phone: string (optional)
  notes: string (optional)
  eventId: ObjectId (required, ref: Event)
  status: 'PENDING' | 'APPROVED' | 'REJECTED' (default: 'PENDING')
  checkedIn: boolean (default: false)
  checkInTime: Date (optional)
  createdAt: Date
  updatedAt: Date
}
// Index: { email: 1, eventId: 1 } (unique)
```

### 9.4 Notification Model
```typescript
{
  userId: string (required, 'admin' or ObjectId string)
  type: 'OWNER_REGISTRATION' | 'OWNER_APPROVED' | 'OWNER_REJECTED' | 'NEW_ATTENDEE'
  title: string (required)
  message: string (required)
  read: boolean (default: false)
  metadata: object (optional)
  createdAt: Date
  updatedAt: Date
}
// Index: { userId: 1, read: 1, createdAt: -1 }
```

---

## 10. Security Requirements

### 10.1 Authentication Security
- Passwords must be hashed using bcrypt (10 rounds)
- JWT tokens must expire after 7 days
- Tokens must be stored in HTTP-only cookies
- Session validation on protected routes

### 10.2 Authorization Security
- Role-based access control (ADMIN, OWNER)
- Protected API endpoints
- Owner can only access own events/attendees
- Admin has full system access

### 10.3 Data Security
- Input validation on all forms
- SQL injection protection (N/A - NoSQL)
- XSS protection
- Secure file upload handling
- Email uniqueness enforcement

### 10.4 Current Limitations (Version 1)
- QR codes validated on frontend only
- Admin credentials hardcoded (for demo)
- No email/SMS notifications
- Basic security implementation

### 10.5 Production Recommendations
- Move admin credentials to secure storage
- Implement backend QR validation
- Add rate limiting
- Enable HTTPS
- Use environment-specific secrets
- Add email verification
- Implement 2FA for admins

---

## 11. Future Enhancements

### 11.1 Planned Features (Version 2)
- Email/SMS notifications
- Backend QR validation
- Real-time check-in dashboard
- Enhanced event analytics
- Multi-tenant support
- Payment integration
- Mobile app
- Advanced security features

### 11.2 Potential Enhancements
- Social media integration
- Event promotion tools
- Advanced reporting
- Custom branding for owners
- API for third-party integrations
- Multi-language support
- Advanced search and filtering

---

## Document Approval

**Prepared by**: Development Team  
**Reviewed by**: [Reviewer Name]  
**Approved by**: [Approver Name]  
**Date**: [Date]

---

**End of Document**

