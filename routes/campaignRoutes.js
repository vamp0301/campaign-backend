const express = require("express");
const router = express.Router();

const {
    createCampaign,
    getMyCampaigns,
    getAllCampaigns,
    getCampaignById,
    updateCampaign,
    deleteCampaign,
    getCampaignSummary,
    exportCampaigns,
    searchCampaigns
} = require("../controllers/campaignController");

const {
    auth,
    isAdmin
} = require("../middleware/authMiddleware");


// ================= USER ROUTES =================

// Create Campaign
router.post("/", auth, createCampaign);

// Get Logged-in User Campaigns
router.get("/my", auth, getMyCampaigns);

// Update Campaign
router.put("/:id", auth, updateCampaign);

// Delete Campaign
router.delete("/:id", auth, deleteCampaign);


// ================= ADMIN ROUTES =================

// Get Campaign Summary
router.get("/summary", auth, isAdmin, getCampaignSummary);

// Get All Campaigns
router.get("/admin/all", auth, isAdmin, getAllCampaigns);

// Get Single Campaign Details
router.get("/admin/:id", auth, isAdmin, getCampaignById);
router.get("/export", auth, isAdmin, exportCampaigns);
router.get("/search", auth, isAdmin, searchCampaigns);

module.exports = router;