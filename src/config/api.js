const API_BASE_URL = 'http://localhost:8081/api'

export const API_ENDPOINTS = {
  FLOTAS: `${API_BASE_URL}/flotas`,
  REGISTROS: `${API_BASE_URL}/registros`,
  VALIDAR_LICENCIA: (licenseNumber) => `${API_BASE_URL}/drivers/validar/${licenseNumber}`,
  FLOTAS_CONDUCTOR: (licenseNumber) => `${API_BASE_URL}/drivers/flotas/${licenseNumber}`
}

export default API_BASE_URL

