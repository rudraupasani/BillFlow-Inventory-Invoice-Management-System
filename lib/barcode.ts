// Barcode utility functions

/**
 * Generate a simple barcode from product SKU or ID
 * Format: EAN-13 compatible barcode
 */
export function generateBarcode(productId: string, sku: string): string {
  // Simple barcode generation using SKU and product ID
  // In production, use a proper barcode library
  const timestamp = Date.now().toString()
  const code = `${sku.padEnd(6, '0')}${productId.substring(0, 6).padEnd(6, '0')}`
  
  // Generate EAN-13 checksum
  let sum = 0
  for (let i = 0; i < code.length; i++) {
    sum += parseInt(code[i]) * (i % 2 === 0 ? 1 : 3)
  }
  const checksum = (10 - (sum % 10)) % 10
  
  return code + checksum.toString()
}

/**
 * Format barcode for display
 */
export function formatBarcode(barcode: string): string {
  // Add hyphens for readability
  return barcode.substring(0, 4) + '-' + 
         barcode.substring(4, 8) + '-' + 
         barcode.substring(8, 12) + '-' + 
         barcode.substring(12)
}

/**
 * Validate EAN-13 barcode
 */
export function validateBarcode(barcode: string): boolean {
  if (barcode.length !== 13) return false
  
  let sum = 0
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(barcode[i])
    if (isNaN(digit)) return false
    sum += digit * (i % 2 === 0 ? 1 : 3)
  }
  
  const checksum = (10 - (sum % 10)) % 10
  return parseInt(barcode[12]) === checksum
}
