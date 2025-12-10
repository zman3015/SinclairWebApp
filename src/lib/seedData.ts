import { collection, addDoc, serverTimestamp, writeBatch, doc, query, where, getDocs, deleteDoc } from "firebase/firestore"
import { db } from "./firebase"

// Admin user ID - update this after creating admin account
const ADMIN_UID = "ADMIN_USER_ID_HERE"

export const seedData = async (userId: string) => {
  try {
    console.log("🌱 Starting to seed test data...")

    // Seed Clients/Accounts
    const clients = [
      {
        name: "Bright Smiles Dental",
        accountNumber: "ACC-001",
        address: "123 Main St, Los Angeles, CA 90001",
        phone: "(310) 555-0001",
        email: "contact@brightsmiles.com",
        territory: "West",
        status: "Active",
        loyaltyTier: "Platinum",
        contractStatus: "Active",
        lat: 34.0522,
        lng: -118.2437,
        equipmentCount: 8,
        lastService: new Date("2024-11-15"),
        nextService: new Date("2025-02-15"),
        createdBy: userId,
        createdAt: serverTimestamp()
      },
      {
        name: "Family Dental Care",
        accountNumber: "ACC-002",
        address: "456 Oak Ave, Pasadena, CA 91101",
        phone: "(626) 555-0002",
        email: "info@familydentalcare.com",
        territory: "West",
        status: "Active",
        loyaltyTier: "Gold",
        contractStatus: "Active",
        lat: 34.1478,
        lng: -118.1445,
        equipmentCount: 5,
        lastService: new Date("2024-11-20"),
        nextService: new Date("2025-02-20"),
        createdBy: userId,
        createdAt: serverTimestamp()
      },
      {
        name: "Downtown Dental Group",
        accountNumber: "ACC-003",
        address: "789 Broadway, San Diego, CA 92101",
        phone: "(619) 555-0003",
        email: "hello@downtowndental.com",
        territory: "South",
        status: "Active",
        loyaltyTier: "Silver",
        contractStatus: "Renewal Due",
        lat: 32.7157,
        lng: -117.1611,
        equipmentCount: 12,
        lastService: new Date("2024-10-10"),
        nextService: new Date("2025-01-10"),
        createdBy: userId,
        createdAt: serverTimestamp()
      },
      {
        name: "Coastal Dental Studio",
        accountNumber: "ACC-004",
        address: "321 Beach Blvd, Santa Monica, CA 90401",
        phone: "(310) 555-0004",
        email: "contact@coastaldental.com",
        territory: "West",
        status: "Active",
        loyaltyTier: "Platinum",
        contractStatus: "Active",
        lat: 34.0195,
        lng: -118.4912,
        equipmentCount: 10,
        lastService: new Date("2024-11-25"),
        nextService: new Date("2025-02-25"),
        createdBy: userId,
        createdAt: serverTimestamp()
      },
      {
        name: "Valley Dental Associates",
        accountNumber: "ACC-005",
        address: "555 Valley Dr, Van Nuys, CA 91401",
        phone: "(818) 555-0005",
        email: "info@valleydental.com",
        territory: "North",
        status: "Active",
        loyaltyTier: "Gold",
        contractStatus: "Active",
        lat: 34.1897,
        lng: -118.4514,
        equipmentCount: 6,
        lastService: new Date("2024-11-10"),
        nextService: new Date("2025-02-10"),
        createdBy: userId,
        createdAt: serverTimestamp()
      }
    ]

    console.log("📋 Adding clients...")
    const clientIds = []
    for (const client of clients) {
      const docRef = await addDoc(collection(db, "clients"), client)
      clientIds.push(docRef.id)
      console.log(`✅ Added client: ${client.name}`)
    }

    // Seed Equipment
    const equipment = [
      {
        code: `MDL-${Date.now()}-AA01`,
        clinic: "Bright Smiles Dental",
        clientId: clientIds[0],
        serialNumber: "AS500-2023-001",
        brand: "A-Dec",
        model: "SC5PLUS, TRI MOTOR, 3-5 USERS, 120V",
        purchaseDate: "2023-01-15",
        warrantyExpiration: "2025-01-15",
        status: "Active",
        lastService: "2024-11-15",
        nextService: "2025-02-15",
        repairs: 2,
        qrData: "",
        createdBy: userId,
        createdAt: serverTimestamp()
      },
      {
        code: `MDL-${Date.now()}-AA02`,
        clinic: "Bright Smiles Dental",
        clientId: clientIds[0],
        serialNumber: "AS500-2023-002",
        brand: "A-Dec",
        model: "DV5PLUS, DRY VACUUM, 1-5 USERS",
        purchaseDate: "2023-02-20",
        warrantyExpiration: "2025-02-20",
        status: "Active",
        lastService: "2024-11-15",
        nextService: "2025-02-15",
        repairs: 1,
        qrData: "",
        createdBy: userId,
        createdAt: serverTimestamp()
      },
      {
        code: `MDL-${Date.now()}-BB01`,
        clinic: "Family Dental Care",
        clientId: clientIds[1],
        serialNumber: "BL300-2023-001",
        brand: "Belmont",
        model: "Dental Chair Model X3",
        purchaseDate: "2023-03-10",
        warrantyExpiration: "2025-03-10",
        status: "Active",
        lastService: "2024-11-20",
        nextService: "2025-02-20",
        repairs: 0,
        qrData: "",
        createdBy: userId,
        createdAt: serverTimestamp()
      },
      {
        code: `MDL-${Date.now()}-CC01`,
        clinic: "Downtown Dental Group",
        clientId: clientIds[2],
        serialNumber: "MM400-2023-001",
        brand: "Midmark",
        model: "Dental Unit Pro",
        purchaseDate: "2023-04-15",
        warrantyExpiration: "2025-04-15",
        status: "Needs Service",
        lastService: "2024-10-10",
        nextService: "2025-01-10",
        repairs: 4,
        qrData: "",
        createdBy: userId,
        createdAt: serverTimestamp()
      },
      {
        code: `MDL-${Date.now()}-DD01`,
        clinic: "Coastal Dental Studio",
        clientId: clientIds[3],
        serialNumber: "AD600-2024-001",
        brand: "A-Dec",
        model: "SC7PLUS, QUAD MOTOR, 5-7 USERS, 240V",
        purchaseDate: "2024-01-20",
        warrantyExpiration: "2026-01-20",
        status: "Active",
        lastService: "2024-11-25",
        nextService: "2025-02-25",
        repairs: 0,
        qrData: "",
        createdBy: userId,
        createdAt: serverTimestamp()
      }
    ]

    console.log("🔧 Adding equipment...")
    const equipmentIds = []
    for (const equip of equipment) {
      equip.qrData = `${equip.code}|${equip.clinic}|${equip.serialNumber}|${equip.brand}|${equip.model}|${equip.purchaseDate}|${equip.warrantyExpiration}`
      const docRef = await addDoc(collection(db, "equipment"), equip)
      equipmentIds.push(docRef.id)
      console.log(`✅ Added equipment: ${equip.brand} ${equip.model}`)
    }

    // Seed Invoices
    const invoices = [
      {
        invoiceNumber: "INV-2024-001",
        client: "Bright Smiles Dental",
        clientId: clientIds[0],
        date: "2024-11-15",
        dueDate: "2024-12-15",
        status: "Paid",
        subtotal: 450.00,
        tax: 40.50,
        total: 490.50,
        items: [
          { description: "Routine Maintenance - A-Dec Chair", quantity: 1, rate: 200.00, amount: 200.00 },
          { description: "Hydraulic Pump Replacement", quantity: 1, rate: 250.00, amount: 250.00 }
        ],
        createdBy: userId,
        createdAt: serverTimestamp()
      },
      {
        invoiceNumber: "INV-2024-002",
        client: "Family Dental Care",
        clientId: clientIds[1],
        date: "2024-11-20",
        dueDate: "2024-12-20",
        status: "Pending",
        subtotal: 325.00,
        tax: 29.25,
        total: 354.25,
        items: [
          { description: "Emergency Repair - Dental Unit", quantity: 1, rate: 325.00, amount: 325.00 }
        ],
        createdBy: userId,
        createdAt: serverTimestamp()
      },
      {
        invoiceNumber: "INV-2024-003",
        client: "Downtown Dental Group",
        clientId: clientIds[2],
        date: "2024-10-10",
        dueDate: "2024-11-10",
        status: "Overdue",
        subtotal: 875.00,
        tax: 78.75,
        total: 953.75,
        items: [
          { description: "Annual Inspection - All Equipment", quantity: 12, rate: 50.00, amount: 600.00 },
          { description: "Part Replacement - Control Panel", quantity: 1, rate: 275.00, amount: 275.00 }
        ],
        createdBy: userId,
        createdAt: serverTimestamp()
      }
    ]

    console.log("💰 Adding invoices...")
    for (const invoice of invoices) {
      await addDoc(collection(db, "invoices"), invoice)
      console.log(`✅ Added invoice: ${invoice.invoiceNumber}`)
    }

    // Seed Inventory/Parts
    const parts = [
      {
        sku: "AD-500-HP-001",
        name: "Hydraulic Pump Assembly",
        category: "Hydraulics",
        brand: "A-Dec",
        compatibleModels: ["SC5PLUS", "SC7PLUS"],
        quantity: 8,
        reorderLevel: 3,
        unitPrice: 385.00,
        supplier: "A-Dec Parts Direct",
        location: "Warehouse A - Shelf 12",
        status: "In Stock",
        createdBy: userId,
        createdAt: serverTimestamp()
      },
      {
        sku: "AD-500-CP-002",
        name: "Control Panel",
        category: "Electronics",
        brand: "A-Dec",
        compatibleModels: ["SC5PLUS", "SC7PLUS", "SC10PLUS"],
        quantity: 2,
        reorderLevel: 3,
        unitPrice: 275.00,
        supplier: "A-Dec Parts Direct",
        location: "Warehouse A - Shelf 8",
        status: "Low Stock",
        createdBy: userId,
        createdAt: serverTimestamp()
      },
      {
        sku: "AD-500-SK-003",
        name: "Seal Kit",
        category: "Maintenance",
        brand: "A-Dec",
        compatibleModels: ["SC3PLUS", "SC5PLUS", "SC7PLUS"],
        quantity: 25,
        reorderLevel: 10,
        unitPrice: 45.00,
        supplier: "A-Dec Parts Direct",
        location: "Warehouse B - Bin 5",
        status: "In Stock",
        createdBy: userId,
        createdAt: serverTimestamp()
      },
      {
        sku: "BL-300-MK-001",
        name: "Motor Kit",
        category: "Motors",
        brand: "Belmont",
        compatibleModels: ["X3", "X5"],
        quantity: 1,
        reorderLevel: 2,
        unitPrice: 425.00,
        supplier: "Belmont Supply Co",
        location: "Warehouse A - Shelf 15",
        status: "Low Stock",
        createdBy: userId,
        createdAt: serverTimestamp()
      },
      {
        sku: "MM-400-FM-001",
        name: "Filter Module",
        category: "Filters",
        brand: "Midmark",
        compatibleModels: ["Pro", "Elite"],
        quantity: 15,
        reorderLevel: 5,
        unitPrice: 65.00,
        supplier: "Midmark Direct",
        location: "Warehouse B - Bin 12",
        status: "In Stock",
        createdBy: userId,
        createdAt: serverTimestamp()
      }
    ]

    console.log("📦 Adding inventory/parts...")
    for (const part of parts) {
      await addDoc(collection(db, "parts"), part)
      console.log(`✅ Added part: ${part.name}`)
    }

    // Seed Service Records
    const services = [
      {
        equipmentId: equipmentIds[0],
        client: "Bright Smiles Dental",
        equipment: "A-Dec SC5PLUS",
        serviceType: "Routine Maintenance",
        date: "2024-11-15",
        technician: "Admin User",
        technicianId: userId,
        status: "Completed",
        description: "Annual maintenance and inspection. Replaced hydraulic seals.",
        partsUsed: [
          { sku: "AD-500-SK-003", name: "Seal Kit", quantity: 1, cost: 45.00 }
        ],
        laborHours: 2.5,
        laborRate: 85.00,
        laborCost: 212.50,
        partsCost: 45.00,
        totalCost: 257.50,
        createdBy: userId,
        createdAt: serverTimestamp()
      },
      {
        equipmentId: equipmentIds[2],
        client: "Family Dental Care",
        equipment: "Belmont Dental Chair X3",
        serviceType: "Emergency Repair",
        date: "2024-11-20",
        technician: "Admin User",
        technicianId: userId,
        status: "Completed",
        description: "Chair not rising properly. Diagnosed motor issue.",
        partsUsed: [],
        laborHours: 3.0,
        laborRate: 85.00,
        laborCost: 255.00,
        partsCost: 0.00,
        totalCost: 255.00,
        createdBy: userId,
        createdAt: serverTimestamp()
      }
    ]

    console.log("🔧 Adding service records...")
    for (const service of services) {
      await addDoc(collection(db, "services"), service)
      console.log(`✅ Added service: ${service.serviceType} for ${service.client}`)
    }

    // Seed Schedule/Appointments
    const schedules = [
      {
        client: "Coastal Dental Studio",
        clientId: clientIds[3],
        date: "2024-12-05",
        time: "09:00 AM",
        duration: 120,
        type: "Routine Maintenance",
        technician: "Admin User",
        technicianId: userId,
        status: "Scheduled",
        equipment: "A-Dec SC7PLUS",
        notes: "Annual inspection and preventive maintenance",
        createdBy: userId,
        createdAt: serverTimestamp()
      },
      {
        client: "Valley Dental Associates",
        clientId: clientIds[4],
        date: "2024-12-06",
        time: "02:00 PM",
        duration: 90,
        type: "Installation",
        technician: "Admin User",
        technicianId: userId,
        status: "Scheduled",
        equipment: "New Dental Chair",
        notes: "Install new dental chair unit",
        createdBy: userId,
        createdAt: serverTimestamp()
      },
      {
        client: "Downtown Dental Group",
        clientId: clientIds[2],
        date: "2024-12-10",
        time: "10:30 AM",
        duration: 180,
        type: "Repair",
        technician: "Admin User",
        technicianId: userId,
        status: "Scheduled",
        equipment: "Midmark Dental Unit Pro",
        notes: "Follow-up repair for control panel replacement",
        createdBy: userId,
        createdAt: serverTimestamp()
      }
    ]

    console.log("📅 Adding schedules...")
    for (const schedule of schedules) {
      await addDoc(collection(db, "schedules"), schedule)
      console.log(`✅ Added schedule: ${schedule.type} for ${schedule.client}`)
    }

    console.log("✅ All test data seeded successfully!")
    return { success: true, message: "Test data added successfully!" }
  } catch (error) {
    console.error("❌ Error seeding data:", error)
    return { success: false, error }
  }
}

export const deleteAllUserData = async (userId: string) => {
  try {
    console.log("🗑️ Starting to delete all data for user:", userId)

    const collections = [
      "clients",
      "equipment",
      "invoices",
      "parts",
      "services",
      "schedules"
    ]

    let totalDeleted = 0

    for (const collectionName of collections) {
      console.log(`🗑️ Deleting ${collectionName}...`)
      const q = query(collection(db, collectionName), where("createdBy", "==", userId))
      const snapshot = await getDocs(q)

      console.log(`Found ${snapshot.size} ${collectionName} to delete`)

      // Delete in batches
      const batch = writeBatch(db)
      let batchCount = 0

      for (const docSnapshot of snapshot.docs) {
        batch.delete(docSnapshot.ref)
        batchCount++
        totalDeleted++

        // Firestore batch limit is 500
        if (batchCount >= 500) {
          await batch.commit()
          batchCount = 0
        }
      }

      // Commit remaining deletes
      if (batchCount > 0) {
        await batch.commit()
      }

      console.log(`✅ Deleted ${snapshot.size} ${collectionName}`)
    }

    console.log(`✅ Total deleted: ${totalDeleted} documents`)
    return { success: true, deletedCount: totalDeleted, message: `Successfully deleted ${totalDeleted} documents` }
  } catch (error) {
    console.error("❌ Error deleting data:", error)
    return { success: false, error, deletedCount: 0 }
  }
}
