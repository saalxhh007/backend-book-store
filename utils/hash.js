import bcrypt from "bcrypt"

async function hashValue(value) {
  return await bcrypt.hash(value, 10)
}

async function compareValue(value, hash) {
  return await bcrypt.compare(value, hash)
}

export default { hashValue, compareValue }