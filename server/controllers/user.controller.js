import { userModel } from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only updte your own account"));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          // will update the info only if the user wants change it otherwise it will ignore the info that doesn't need to be changed or if the user doesn't want to update the other data
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    ); // added new: true so that we get the new information as the response of this function and not the previous information before this update
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account"));
  try {
    await userModel.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token')
    res.status(200).json("User has been deleted!");
  } catch (error) {
    next(error);
  }
};

export { updateUser, deleteUser };
