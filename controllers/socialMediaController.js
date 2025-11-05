import SocialMedia from "../models/socialMediaModel.js";
import SocialMediaCredential from "../models/socialMediaCredentialModel.js";
import Settings from "../models/settings.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
const createSocialMediaAccount = async (req, res) => {
  try {
    const socialMediaAccount = new SocialMedia(req.body);
    await socialMediaAccount.save();
    res.status(201).json({
      message: "Social Media created successfully",
      socialMediaAccount,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ errors });
    } else {
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
    res.status(400).json({ error: error.message });
  }
};

// const getSocialMediaAccount = async (req, res) => {
//     const password = await settings.findOne({ key: "password" });
//     if (!password) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Password not found" });
//     }
//   const socialMediaAccount = await socialMedia.find();
//   if (!socialMediaAccount) {
//     return res
//       .status(404)
//       .json({ success: false, message: "Social Media not found" });
//   }
//   res.status(200).json({ success: true, data: socialMediaAccount });
// };

const getSocialMediaAccount = async (req, res) => {
  try {
    // const { password } = req.query;

    // const passwordSetting = await Settings.findOne();
    // if (!passwordSetting) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "Settings not found" });
    // }

    // const isMatch = await bcrypt.compare(password, passwordSetting.password);
    // if (!isMatch) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Invalid password" });
    // }

    const socialMediaAccounts = await SocialMedia.find();
    if (!socialMediaAccounts || socialMediaAccounts.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No social media accounts found" });
    }

    return res.status(200).json({ success: true, data: socialMediaAccounts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const editSocialMediaAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const socialMediaAccount = await SocialMedia.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!socialMediaAccount) {
      return res.status(404).json({ message: "Social Media not found" });
    }
    res.status(200).json({
      message: "Social Media updated successfully",
      socialMediaAccount,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const deleteSocialMedia = async (req, res) => {
  const { id } = req.params;
  try {
    const socialMedia = await SocialMedia.findByIdAndDelete(id);
    if (!socialMedia) {
      return res.status(404).json({ message: "Social Media not found" });
    }
    res
      .status(200)
      .json({ message: "Social Media deleted successfully", socialMedia });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const createSocialMediaCredential = async (req, res) => {
  try {
    const socialMediaAccount = new SocialMediaCredential(req.body);
    await socialMediaAccount.save();
    res.status(201).json({
      message: "Social Media Credential  created successfully",
      socialMediaAccount,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ errors });
    } else {
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
    res.status(400).json({ error: error.message });
  }
};

const getSocialMediaCredential = async (req, res) => {
  const { password } = req.query;

  const passwordSetting = await Settings.findOne();
  if (!passwordSetting) {
    return res
      .status(404)
      .json({ success: false, message: "Settings not found" });
  }

  const isMatch = await bcrypt.compare(password, passwordSetting.password);
  if (!isMatch) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid password" });
  }

  const socialMediaAccount = await SocialMediaCredential.find({}).populate("account", "name");
  if (!socialMediaAccount) {
    return res
      .status(404)
      .json({ success: false, message: "Social Media Credential not found" });
  }
  res.status(200).json({ success: true, data: socialMediaAccount });
};

const editSocialMediaCredential = async (req, res) => {
  try {
    const { id } = req.params;
    const socialMedia = await SocialMediaCredential.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!socialMedia) {
      return res.status(404).json({ message: "Social Media not found" });
    }
    res
      .status(200)
      .json({ message: "Social Media updated successfully", socialMedia });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const deleteSocialMediaCredential = async (req, res) => {
  const { id } = req.params;
  try {
    const socialMedia = await SocialMediaCredential.findByIdAndDelete(id);
    if (!socialMedia) {
      return res
        .status(404)
        .json({ message: "Social Media Credential not found" });
    }
    res
      .status(200)
      .json({ message: "Social Media deleted successfully", socialMedia });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const getSocialMediaName = async (req, res) => {
  const socialMediaAccount = await SocialMedia.find({ status: "1" }).select(
    "name"
  );
  if (!socialMediaAccount) {
    return res
      .status(404)
      .json({ success: false, message: "Social Media not found" });
  }
  res.status(200).json({ success: true, data: socialMediaAccount });
};

export {
  createSocialMediaAccount,
  getSocialMediaAccount,
  editSocialMediaAccount,
  deleteSocialMedia,

  //credentials
  getSocialMediaName,
  createSocialMediaCredential,
  getSocialMediaCredential,
  editSocialMediaCredential,
  deleteSocialMediaCredential,
};
