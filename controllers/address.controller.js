import Address from "../models/addressModel.js";

const createAddress = async (req, res) => {
  try {
    const { user_id, line1, line2, state, district, municipality } = req.body
    const newAddress = await Address.create({
      user_id,
      line1,
      line2,
      state,
      district,
      municipality
    })
    res.status(201).json(newAddress)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getMyAddresses = async (req, res) => {
  try {
    const addresses = await Address.findAll({
      where: { user_id: req.user.id }
    })
    res.json(addresses)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateAddress = async (req, res) => {
  try {
    const { id } = req.params
    const address = await Address.findOne({
      where: { id, user_id: req.user.id }
    })

    if (!address) {
      return res.status(404).json({ message: "Address not found" })
    }

    await address.update(req.body)
    res.json(address)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params
    const address = await Address.findOne({
      where: { id, user_id: req.user.id }
    })

    if (!address) {
      return res.status(404).json({ message: "Address not found" })
    }

    await address.destroy()
    res.json({ message: "Address deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const allAdresses = async (req, res) => {
  try {
    const addresses = await Address.findAll()
    if (!addresses) {
      return res.status(404).json({ message: "No Address found" })
    }
    res.json(addresses)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export default { createAddress, getMyAddresses, updateAddress, deleteAddress, allAdresses }