import Complaint from "./../models/complaintModel.js"

export const sendComplaint = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, subject, message } = req.body 

    const complaint = await Complaint.create({
      first_name,
      last_name,
      email,
      phone,
      subject,
      message,
    })

    res.status(201).json({ success: true, complaint })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: "Server error" })
  }
}

export const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.findAll({ order: [["createdAt", "DESC"]] })
    res.json({ success: true, complaints })
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" })
  }
}

export const getComplaint = async (req, res) => {
  try {
    const complaint = Complaint.findByPk(id)
    if (!complaint) return res.status(404).json({ success: false, error: "Complaint not found" })
    res.json({ success: true, complaint })
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" })
  }
}

export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const complaint = await Complaint.findByPk(id)
    if (!complaint) return res.status(404).json({ success: false, error: "Complaint not found" })

    complaint.status = status
    await complaint.save()

    res.json({ success: true, complaint })
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" })
  }
}

export const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params
    const complaint = await Complaint.findByPk(id)

    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" })
    }

    await complaint.destroy();
    res.json({ message: "Complaint deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: "Failed to delete complaint" })
  }
}