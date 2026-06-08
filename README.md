# Steakz MIS – Frontend

React + TypeScript frontend for the Steakz Management Information System.

## Roles & Access
| Role | Access |
|------|--------|
| ADMIN | User management, branch management, menu, inventory, access logs |
| HQ_MANAGER | All-branch staff, menus, inventory, reservations, sales analytics |
| MANAGER | Branch staff, menu overview, inventory, reservations, sales |
| CHEF | Incoming orders, order history |
| CASHIER | Order management, payment processing, payment history |
| CUSTOMER | Menu, reservations, contact, reviews |

## Setup
```bash
npm install
npm start
```

Requires backend running on `http://localhost:3000`.

## Backend
See: https://github.com/sderrick21/steakz-mis-backend
