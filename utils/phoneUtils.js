function normalizeNum(phone) {
  let cleaned = phone.replace(/\D/g, "")

  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1)
  }
  if (!cleaned.startsWith('213')) {
    cleaned = '213' + cleaned
  }
  if (!/^213[5-7]\d{8}$/.test(cleaned)) {
    throw new Error(`Invalid Algerian phone number ${(cleaned)}`)
  }
  return cleaned
}

export default normalizeNum
