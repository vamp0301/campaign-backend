const { Parser } = require("json2csv");
const Campaign = require("../models/Campaign");


// Create Campaign
exports.createCampaign = async (req, res) => {

  try {

    console.log("REQ.USER =", req.user);

    const { name, message, mobileNumbers } = req.body;

    if (!name || !message || !mobileNumbers) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const campaign = await Campaign.create({
      name,
      message,
      mobileNumbers,
      recipientCount: mobileNumbers.length,

      // TEMPORARY
      broadcasterId: req.user.id
    });

    return res.status(201).json({
      success: true,
      campaign
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// Get My Campaigns
exports.getMyCampaigns = async (req, res) => {

    try {

        const campaigns = await Campaign.find({
            broadcasterId: req.user.id
        });

        res.status(200).json({
            success: true,
            campaigns
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};


// Get All Campaigns (Admin)
exports.getAllCampaigns = async (req, res) => {

    try {

        const campaigns = await Campaign.find()
        .populate("broadcasterId", "name email")
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            campaigns
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};


// Get Single Campaign
exports.getCampaignById = async (req, res) => {

    try {

        const campaign = await Campaign.findById(req.params.id)
        .populate("broadcasterId", "name email");

        if (!campaign) {

            return res.status(404).json({
                success: false,
                message: "Campaign not found"
            });
        }

        res.status(200).json({
            success: true,
            campaign
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};


// Update Campaign
exports.updateCampaign = async (req, res) => {

    try {

        const updatedCampaign = await Campaign.findByIdAndUpdate(

            req.params.id,

            req.body,

            {

                new: true

            }

        );

        res.status(200).json({

            success: true,

            campaign: updatedCampaign

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};


// Delete Campaign
exports.deleteCampaign = async (req, res) => {

    try {

        await Campaign.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Campaign deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

//summary of campaigns
exports.getCampaignSummary = async (req, res) => {

    try {

        const totalCampaigns = await Campaign.countDocuments();

        const pending = await Campaign.countDocuments({
            status: "pending"
        });

        const processing = await Campaign.countDocuments({
            status: "processing"
        });

        const completed = await Campaign.countDocuments({
            status: "completed"
        });

        res.status(200).json({
            success: true,
            totalCampaigns,
            pending,
            processing,
            completed
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};
// Export Campaign Report (CSV)
exports.exportCampaigns = async (req, res) => {

    try {

        const campaigns = await Campaign.find()
            .populate("broadcasterId", "name email");

        const reportData = campaigns.map(campaign => ({
            CampaignName: campaign.name,
            Message: campaign.message,
            Status: campaign.status,
            RecipientCount: campaign.recipientCount,
            BroadcasterName: campaign.broadcasterId?.name,
            BroadcasterEmail: campaign.broadcasterId?.email,
            CreatedAt: campaign.createdAt
        }));

        const parser = new Parser();

        const csv = parser.parse(reportData);

        res.header("Content-Type", "text/csv");

        res.attachment("campaign-report.csv");

        return res.send(csv);

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// Search Campaigns
exports.searchCampaigns = async (req, res) => {

    try {

        const { keyword } = req.query;

        const campaigns = await Campaign.find({

            $or: [

                {
                    name: {
                        $regex: keyword,
                        $options: "i"
                    }
                },

                {
                    message: {
                        $regex: keyword,
                        $options: "i"
                    }
                },

                {
                    status: {
                        $regex: keyword,
                        $options: "i"
                    }
                }

            ]

        }).populate("broadcasterId", "name email");

        res.status(200).json({
            success: true,
            totalResults: campaigns.length,
            campaigns
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};