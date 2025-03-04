import cloudinary from "../Lib/Cloudinary.js";
import User from "../Models/User.Model.js";

// ✅ Uploads profile picture to Cloudinary & updates user profile
export const UploadProfilePic = async (req, res) => {
    try {
        const { profilePic } = req.body;  // Image data (base64 or URL)
        const userId = req.user._id;  // Authenticated user ID

        if (!profilePic) {
            return res.status(400).json({ message: "ProfilePic is Required" });
        }

        // ✅ Upload image to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        // ✅ Update user's profile picture in database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true } // Return updated document
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error in UploadProfilePic:", error); // ❌ Console log found
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// ✅ Get user details by ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("fullname profilePic email");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
