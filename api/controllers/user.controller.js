import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';

export const test = (req, res) => {
  res.json({
    message: 'API is working',
  });
};

// Update user
export const updateUser = async (req, res, next) => {
  try {
    // Check if the user exists
    const existingUser = await User.findById(req.params.id);
    if (!existingUser) {
      return next(errorHandler(404, 'User not found'));
    }

    // Ensure that the user updating is the owner of the account
    if (req.user.id !== existingUser._id.toString()) {
      return next(errorHandler(401, 'You can update only your account!'));
    }

    // Hash the password if provided
    if (req.body.password) {
      req.body.password = await bcryptjs.hash(req.body.password, 10);
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      {
        new: true,
      }
    );

    // Destructure password from the updated user before sending the response
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    // Handle errors appropriately (e.g., log the error or send an error response)
    console.error(error);
    return next(errorHandler(500, 'Internal Server Error'));
  }
};
