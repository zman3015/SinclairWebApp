# Data Layer Documentation

This document describes the strongly-typed Firestore data layer for the Dental Tech Portal application.

## Architecture Overview

The data layer is organized into four main modules:

```
src/lib/
├── firebase/         # Firebase configuration and utilities
│   ├── config.ts    # Firebase app initialization
│   ├── converters.ts # Type-safe Firestore converters
│   ├── errors.ts    # Centralized error handling
│   └── index.ts     # Main exports
├── models/          # TypeScript types and Zod schemas
│   ├── client.ts
│   ├── equipment.ts
│   ├── invoice.ts
│   ├── part.ts
│   ├── schedule.ts
│   ├── manual.ts
│   ├── notification.ts
│   ├── harp-inspection.ts
│   ├── service-history.ts
│   ├── shared.ts    # Common types and utilities
│   └── index.ts
├── services/        # Firestore CRUD operations
│   ├── base.ts      # Generic base service
│   ├── client.service.ts
│   ├── equipment.service.ts
│   ├── invoice.service.ts
│   ├── part.service.ts
│   ├── schedule.service.ts
│   ├── manual.service.ts
│   ├── notification.service.ts
│   ├── harp-inspection.service.ts
│   ├── service-history.service.ts
│   └── index.ts
└── hooks/           # React hooks for data fetching
    ├── useClient.ts
    ├── useEquipment.ts
    ├── useInvoice.ts
    ├── usePart.ts
    ├── useSchedule.ts
    ├── useManual.ts
    ├── useNotification.ts
    ├── useHarpInspection.ts
    ├── useServiceHistory.ts
    └── index.ts
```

## Core Entities

### 1. **Client/Account** (`clients` collection)
- Client/dental office information
- Contact details and location
- Territory and loyalty tiers
- Service scheduling data

### 2. **Equipment** (`equipment` collection)
- Medical equipment inventory
- QR code tracking
- Service history references
- Warranty and maintenance dates

### 3. **Invoice** (`invoices` collection)
- Billing and payment tracking
- Line items with parts and services
- Payment status and history

### 4. **Part** (`parts` collection)
- Inventory management
- Stock levels and pricing
- Supplier information
- Equipment compatibility

### 5. **Schedule** (`schedules` collection)
- Service appointments
- Technician assignments
- Client and equipment relationships

### 6. **Manual** (`manuals` collection)
- Service documentation
- Equipment manuals
- File storage references

### 7. **Notification** (`notifications` collection)
- User notifications
- Real-time alerts
- Read/unread status

### 8. **HARP Inspection** (`harp-inspections` collection)
- X-ray inspection forms
- Test results and measurements
- Compliance documentation

### 9. **Service History** (`service-history` collection)
- Repair and maintenance logs
- Parts usage tracking
- Labor costs and time

## Usage Guide

### Using Models (TypeScript Types & Validation)

```typescript
import { Client, ClientSchema } from '@/lib/models'

// Type-safe client data
const client: Client = {
  name: 'Bright Smiles Dental',
  accountNumber: 'ACC-001',
  status: 'Active',
  email: 'contact@brightsmiles.com',
  // ... other fields
}

// Validate with Zod schema
try {
  const validated = ClientSchema.parse(client)
  console.log('Valid client data:', validated)
} catch (error) {
  console.error('Validation errors:', error)
}
```

### Using Services (Direct Firestore Operations)

Services provide low-level CRUD operations with type safety:

```typescript
import { ClientService } from '@/lib/services'

// Create a client
const result = await ClientService.create({
  name: 'New Dental Office',
  accountNumber: 'ACC-123',
  status: 'Active'
}, userId)

if (result.error) {
  console.error(result.error.message)
} else {
  console.log('Created:', result.data)
}

// Get a client by ID
const client = await ClientService.getById('client-id')

// Update a client
await ClientService.update('client-id', {
  status: 'Inactive'
}, userId)

// Delete a client
await ClientService.delete('client-id')

// Get all clients with pagination
const { data } = await ClientService.getAll(
  [{ field: 'status', operator: '==', value: 'Active' }],
  { limit: 20, orderByField: 'name' }
)

// Entity-specific methods
const activeClients = await ClientService.getActive()
const territoryClients = await ClientService.getByTerritory('West')
const searchResults = await ClientService.search('dental')
```

### Using React Hooks (Recommended for Components)

Hooks provide React-friendly APIs with loading/error states:

```typescript
import { useClient, useActiveClients } from '@/lib/hooks'

function ClientList() {
  // Get all clients
  const { clients, loading, error, create, update, remove } = useClient()

  // Get single client
  const { client } = useClient({ clientId: 'client-id' })

  // Get clients with real-time updates
  const { clients: liveClients } = useClient({ realtime: true })

  // Create a new client
  const handleCreate = async () => {
    const newClient = await create({
      name: 'New Office',
      accountNumber: 'ACC-999',
      status: 'Active'
    }, userId)
  }

  // Update a client
  const handleUpdate = async (id: string) => {
    await update(id, { status: 'Inactive' }, userId)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ul>
      {clients.map(client => (
        <li key={client.id}>{client.name}</li>
      ))}
    </ul>
  )
}

// Specialized hooks
function ActiveClientsWidget() {
  const { clients, loading } = useActiveClients()
  // ...
}

function ClientSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const { clients, loading } = useClientSearch(searchTerm)
  // Debounced search with 300ms delay
}
```

### Equipment Examples

```typescript
import { useEquipment, useEquipmentByQR } from '@/lib/hooks'
import { EquipmentService } from '@/lib/services'

// In a component
function EquipmentList({ clientId }: { clientId: string }) {
  const { equipmentList, loading, create } = useEquipment({ clientId })

  const handleAdd = async () => {
    await create({
      name: 'X-Ray Unit',
      type: 'Intraoral X-Ray',
      manufacturer: 'Planmeca',
      model: 'ProX',
      serialNumber: 'PX-12345',
      clientId,
      status: 'Active'
    }, userId)
  }

  return <div>{/* render equipment */}</div>
}

// QR Code Scanner
function QRScanner({ qrCode }: { qrCode: string }) {
  const { equipment, loading } = useEquipmentByQR(qrCode)

  if (loading) return <div>Scanning...</div>
  if (!equipment) return <div>Equipment not found</div>

  return <div>{equipment.name}</div>
}

// Service method examples
const serviceDue = await EquipmentService.getServiceDueSoon(30)
const expiredWarranties = await EquipmentService.getExpiredWarranties()
const bySerialNumber = await EquipmentService.getBySerialNumber('SN-123')
```

### Notifications (Real-time)

```typescript
import { useNotifications, useUnreadNotifications } from '@/lib/hooks'

function NotificationBell() {
  const { count } = useUnreadNotifications()

  return (
    <button>
      🔔 {count > 0 && <span>{count}</span>}
    </button>
  )
}

function NotificationPanel() {
  const {
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    dismiss
  } = useNotifications(true) // realtime: true

  const handleClick = async (notificationId: string) => {
    await markAsRead(notificationId)
  }

  return (
    <div>
      <button onClick={markAllAsRead}>Mark All Read</button>
      {notifications.map(notif => (
        <div
          key={notif.id}
          onClick={() => handleClick(notif.id!)}
          style={{ opacity: notif.read ? 0.5 : 1 }}
        >
          {notif.title}
        </div>
      ))}
    </div>
  )
}
```

### Schedule/Appointments

```typescript
import { useSchedule, useTodayAppointments } from '@/lib/hooks'

function TodaySchedule() {
  const { appointments, loading } = useTodayAppointments()

  return (
    <div>
      <h2>Today's Appointments ({appointments.length})</h2>
      {/* render appointments */}
    </div>
  )
}

function TechnicianSchedule({ technicianId }: { technicianId: string }) {
  const { appointments, create, update } = useSchedule({ technicianId })

  const handleComplete = async (appointmentId: string) => {
    await update(appointmentId, {
      status: 'Completed',
      completedAt: new Date()
    }, userId)
  }

  return <div>{/* render schedule */}</div>
}
```

### Invoices

```typescript
import { useInvoices } from '@/lib/hooks'
import { InvoiceService } from '@/lib/services'

function ClientInvoices({ clientId }: { clientId: string }) {
  const { invoices, loading, create } = useInvoices(clientId)

  const handleCreate = async () => {
    await create({
      invoiceNumber: 'INV-001',
      clientId,
      clientName: 'Client Name',
      subtotal: 100,
      tax: 10,
      total: 110,
      amountPaid: 0,
      amountDue: 110,
      lineItems: [{
        id: crypto.randomUUID(),
        description: 'Service',
        quantity: 1,
        unitPrice: 100,
        total: 100
      }],
      status: 'Draft',
      invoiceDate: new Date(),
      dueDate: new Date()
    }, userId)
  }

  return <div>{/* render invoices */}</div>
}

// Get overdue invoices
const overdueInvoices = await InvoiceService.getOverdue()
const revenue = await InvoiceService.getRevenue(startDate, endDate)
```

### Parts/Inventory

```typescript
import { useParts, useLowStockParts } from '@/lib/hooks'

function InventoryDashboard() {
  const { parts: lowStock, loading } = useLowStockParts()

  return (
    <div>
      <h2>Low Stock Alert ({lowStock.length})</h2>
      {lowStock.map(part => (
        <div key={part.id}>
          {part.name} - {part.quantity}/{part.minQuantity}
        </div>
      ))}
    </div>
  )
}

function PartsList() {
  const { parts, create, update } = useParts()

  const handleUpdateQuantity = async (partId: string, newQty: number) => {
    await update(partId, { quantity: newQty }, userId)
  }

  return <div>{/* render parts */}</div>
}
```

## Error Handling

All services return a consistent error format:

```typescript
interface ServiceResult<T> {
  data?: T
  error?: AppError
}

interface AppError {
  code: string
  message: string
  details?: unknown
}

// Usage
const result = await ClientService.getById('invalid-id')
if (result.error) {
  console.error(`[${result.error.code}] ${result.error.message}`)
  // Display user-friendly message
} else {
  // Use result.data
}
```

## Pagination

Services support pagination for large datasets:

```typescript
import { ClientService } from '@/lib/services'

// First page
const page1 = await ClientService.getAll(
  undefined,
  { limit: 20, orderByField: 'name', orderByDirection: 'asc' }
)

// Next page
const page2 = await ClientService.getAll(
  undefined,
  {
    limit: 20,
    orderByField: 'name',
    orderByDirection: 'asc',
    startAfter: page1.data?.lastDoc
  }
)

console.log('Has more:', page2.data?.hasMore)
```

## Real-time Subscriptions

Services provide real-time listeners for live data:

```typescript
import { ClientService } from '@/lib/services'

// Subscribe to a single document
const unsubscribe = ClientService.subscribeToDoc(
  'client-id',
  (client) => {
    console.log('Client updated:', client)
  },
  (error) => {
    console.error('Subscription error:', error)
  }
)

// Subscribe to a collection
const unsubscribeCollection = ClientService.subscribeToCollection(
  (clients) => {
    console.log('Clients updated:', clients.length)
  },
  undefined,
  [{ field: 'status', operator: '==', value: 'Active' }]
)

// Cleanup
unsubscribe()
unsubscribeCollection()
```

## Migration Guide

To migrate existing pages to use the new data layer:

### Before (old firestore-hooks.ts):
```typescript
const { clients, loading, addClient } = useClients()
```

### After (new data layer):
```typescript
import { useClient } from '@/lib/hooks'
const { clients, loading, create } = useClient()
// Use create instead of addClient
```

## Best Practices

1. **Use Hooks in Components**: Prefer hooks over direct service calls in React components
2. **Use Services in API Routes**: Use services directly in Next.js API routes or server actions
3. **Type Everything**: Leverage TypeScript types for compile-time safety
4. **Validate Inputs**: Use Zod schemas to validate data before saving
5. **Handle Errors**: Always check for errors in service results
6. **Optimize Queries**: Use filters and pagination for large datasets
7. **Real-time When Needed**: Use real-time subscriptions for dashboards and notifications
8. **Clean Up Subscriptions**: Always unsubscribe from real-time listeners

## Collection Names

| Entity | Collection Name | Key Fields |
|--------|----------------|------------|
| Client | `clients` | name, accountNumber, status |
| Equipment | `equipment` | serialNumber, qrCode, clientId |
| Invoice | `invoices` | invoiceNumber, clientId, status |
| Part | `parts` | sku, quantity, category |
| Schedule | `schedules` | technicianId, clientId, startDate |
| Manual | `manuals` | manufacturer, model, fileUrl |
| Notification | `notifications` | userId, read, type |
| HARP Inspection | `harp-inspections` | clientId, equipmentId, status |
| Service History | `service-history` | equipmentId, clientId, technicianId |

## Next Steps

1. Update existing pages to use the new hooks
2. Remove old `firestore-hooks.ts` after migration
3. Add more entity-specific service methods as needed
4. Implement search with Algolia for better performance
5. Add caching layer for frequently accessed data

## Support

For questions or issues with the data layer, refer to:
- Firebase Firestore Documentation: https://firebase.google.com/docs/firestore
- Zod Documentation: https://zod.dev
- React Hooks Documentation: https://react.dev/reference/react
