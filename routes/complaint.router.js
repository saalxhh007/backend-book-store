import express from "express"
import * as complaintController from "./../controllers/complaint.controller.js"

const complaintRouter = express.Router()

complaintRouter.post("/", complaintController.sendComplaint)
complaintRouter.get("/", complaintController.getComplaints)
complaintRouter.get("/:id", complaintController.getComplaint)
complaintRouter.patch("/:id", complaintController.updateComplaintStatus)
complaintRouter.delete("/:id", complaintController.updateComplaintStatus)

export default complaintRouter