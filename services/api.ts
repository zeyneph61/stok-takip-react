const BASE_URL = "http://localhost:5000/api";

async function request(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API hatası: ${response.status}`);
  }

  return response.json();
}


// Temel endpointler için servisler şimdilik sadece getAll var sonrasında ihtiayca göre düzenlenecekler
export const productService = {
  getAll: () => request("/product"),
};

export const stockMovementService = {
  getAll: () => request("/stockmovement"),
};

// Diğer endpointler için servisler 
export const salesReportService = {
  getAll: () => request("/salesreport"),
};

//  ilerisi için (şimdilik kullanmıyoruz ama hazır)
export const categoryService = {
  getAll: () => request("/category"),
};

export const lowStockAlertService = {
  getAll: () => request("/lowstockalert"),
};

export const expiryAlertService = {
  getAll: () => request("/expiryalert"),
};

export const priceHistoryService = {
  getAll: () => request("/pricehistory"),
};