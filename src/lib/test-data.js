// Sample test data for the Klikk demo
export const testUsers = [
  { 
    id: "user_001",
    email: "jon@smartmedia.is", 
    name: "Jón Andreas Gunnlaugsson", 
    mobile: "+3546478000",
    address: {
      street: "Ásbúð 29",
      city: "Garðabær",
      postalCode: "210",
      country: "Ísland"
    },
    paymentMethods: [
      { 
        id: "pm_001", 
        type: "visa", 
        label: "Visa •••• 4242", 
        expiryDate: "09/26",
        isDefault: true
      },
      { 
        id: "pm_002", 
        type: "Aur", 
        label: "AUR (6478000)",
        isDefault: false
      }
    ]
  },
  { 
    id: "user_002",
    email: "jane@example.com", 
    name: "Jane Smith", 
    mobile: "+3546478002",
    address: {
      street: "456 Maple Ave",
      city: "Kopavogur",
      postalCode: "200",
      country: "Iceland"
    },
    paymentMethods: [
      { 
        id: "pm_003", 
        type: "mastercard", 
        label: "Mastercard •••• 5555", 
        expiryDate: "12/25",
        isDefault: true
      }
    ]
  },
  { 
    id: "user_003",
    email: "alex@business.com", 
    name: "Alex Johnson", 
    mobile: "+3546478003",
    address: {
      street: "789 Pine St",
      city: "Akureyri",
      postalCode: "600",
      country: "Iceland"
    },
    paymentMethods: [
      { 
        id: "pm_004", 
        type: "amex", 
        label: "Amex •••• 9876", 
        expiryDate: "03/27",
        isDefault: true
      },
      { 
        id: "pm_005", 
        type: "visa", 
        label: "Visa •••• 1122", 
        expiryDate: "11/24",
        isDefault: false
      }
    ]
  },
  { 
    id: "user_004",
    email: "sarah@gmail.com", 
    name: "Sarah Williams", 
    mobile: "+3546478004",
    address: {
      street: "321 Oak Ln",
      city: "Reykjavik",
      postalCode: "105",
      country: "Iceland"
    },
    paymentMethods: [
      { 
        id: "pm_006", 
        type: "visa", 
        label: "Visa •••• 1234", 
        expiryDate: "08/25",
        isDefault: true
      }
    ]
  },
  { 
    id: "user_005",
    email: "michael@company.com", 
    name: "Michael Brown", 
    mobile: "+3546478005",
    address: {
      street: "567 Birch Rd",
      city: "Keflavik",
      postalCode: "230",
      country: "Iceland"
    },
    paymentMethods: [
      { 
        id: "pm_007", 
        type: "mastercard", 
        label: "Mastercard •••• 6789", 
        expiryDate: "04/26",
        isDefault: true
      }
    ]
  },
  { 
    id: "user_006",
    email: "emily@outlook.com", 
    name: "Emily Davis", 
    mobile: "+3546478006",
    address: {
      street: "890 Cedar Ave",
      city: "Selfoss",
      postalCode: "800",
      country: "Iceland"
    },
    paymentMethods: [
      { 
        id: "pm_008", 
        type: "discover", 
        label: "Discover •••• 5432", 
        expiryDate: "07/27",
        isDefault: true
      }
    ]
  },
  { 
    id: "user_007",
    email: "david@example.org", 
    name: "David Miller", 
    mobile: "+3546478007",
    address: {
      street: "432 Elm St",
      city: "Reykjavik",
      postalCode: "108",
      country: "Iceland"
    },
    paymentMethods: [
      { 
        id: "pm_009", 
        type: "visa", 
        label: "Visa •••• 8765", 
        expiryDate: "02/28",
        isDefault: true
      }
    ]
  },
  { 
    id: "user_008",
    email: "lisa@business.net", 
    name: "Lisa Wilson", 
    mobile: "+3546478008",
    address: {
      street: "654 Spruce Ct",
      city: "Reykjavik",
      postalCode: "112",
      country: "Iceland"
    },
    paymentMethods: [
      { 
        id: "pm_010", 
        type: "amex", 
        label: "Amex •••• 2468", 
        expiryDate: "10/25",
        isDefault: true
      }
    ]
  },
  { 
    id: "user_009",
    email: "robert@gmail.com", 
    name: "Robert Taylor", 
    mobile: "+3546478009",
    address: {
      street: "876 Aspen Ave",
      city: "Hafnarfjordur",
      postalCode: "220",
      country: "Iceland"
    },
    paymentMethods: [
      { 
        id: "pm_011", 
        type: "mastercard", 
        label: "Mastercard •••• 1357", 
        expiryDate: "01/28",
        isDefault: true
      }
    ]
  },
  { 
    id: "user_010",
    email: "jennifer@company.io", 
    name: "Jennifer Anderson", 
    mobile: "+3546478010",
    address: {
      street: "210 Fir Dr",
      city: "Kopavogur",
      postalCode: "201",
      country: "Iceland"
    },
    paymentMethods: [
      { 
        id: "pm_012", 
        type: "visa", 
        label: "Visa •••• 3691", 
        expiryDate: "06/26",
        isDefault: true
      }
    ]
  }
];

// Sample products data
export const products = [
  {
    id: 1,
    name: "Premium Cotton T-Shirt",
    price: 29.99,
    description: "High-quality, sustainable cotton",
    image: "👕",
    variants: [
      { id: "v1", color: "Black", size: "M" },
      { id: "v2", color: "White", size: "M" },
      { id: "v3", color: "Blue", size: "M" }
    ]
  }
];

// Active verification codes storage
// This would be in a database in a real application
export const verificationCodes = new Map();

// Country options for address form
export const countries = [
  { value: "iceland", label: "Iceland" },
  { value: "denmark", label: "Denmark" },
  { value: "norway", label: "Norway" },
  { value: "sweden", label: "Sweden" },
  { value: "finland", label: "Finland" },
  { value: "usa", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "germany", label: "Germany" },
  { value: "france", label: "France" },
  { value: "spain", label: "Spain" }
];