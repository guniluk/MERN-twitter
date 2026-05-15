import User from '../models/user.model.js';
import Post from '../models/post.model.js';
import Notification from '../models/notification.model.js';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';

export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select('-password').populate({
      path: 'following',
      select: 'username profileImg email',
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const postCount = await Post.countDocuments({ user: user._id });
    const userWithPostCount = user.toObject();
    userWithPostCount.postCount = postCount;

    res.status(200).json(userWithPostCount);
  } catch (error) {
    console.log('Error in getUserProfile:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow/unfollow yourself',
      });
    }

    const currentUser = await User.findById(req.user._id);

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

      res.status(200).json({
        success: true,
        message: 'User unfollowed successfully',
      });
    } else {
      // Follow
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      ///send notification
      const newNofitication = new Notification({
        from: req.user._id,
        to: id,
        type: 'follow',
      });
      await newNofitication.save();

      //return the id of the user as a response
      res.status(200).json({
        success: true,
        message: 'User followed successfully',
      });
    }
  } catch (error) {
    console.log('Error in followUnfollowUser:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getSuggestedtUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const usersFollowedByMe = await User.findById(userId).select('following');
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: { size: 10 },
      },
    ]);
    const filteredUser = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id),
    );
    const suggestedUsers = filteredUser.slice(0, 4);
    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log('Error in getSuggestedtUsers:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const updateUser = async (req, res) => {
  const { fullname, email, username, currentPassword, newPassword, bio, link } =
    req.body;
  let { profileImg, coverImg } = req.body;

  const userId = req.user._id;

  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new password',
      });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect',
        });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long',
        });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already exists',
        });
      }
    }

    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists',
        });
      }
    }

    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split('/').pop().split('.')[0],
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedResponse.secure_url;
    }

    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split('/').pop().split('.')[0],
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedResponse.secure_url;
    }

    user.fullname = fullname || user.fullname;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    user = await user.save();

    user.password = null;
    return res.status(200).json(user);
  } catch (error) {
    console.log('Error in updateUserProfile:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // 1. Delete user images from Cloudinary
    if (user.profileImg) {
      const profileImgId = user.profileImg.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(profileImgId);
    }
    if (user.coverImg) {
      const coverImgId = user.coverImg.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(coverImgId);
    }

    // 2. Delete all posts by the user and their images
    const posts = await Post.find({ user: userId });
    const postIds = posts.map((post) => post._id);

    for (const post of posts) {
      if (post.img) {
        const imgId = post.img.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(imgId);
      }
    }
    await Post.deleteMany({ user: userId });

    // 2-1. Remove deleted posts from other users' likedPosts
    await User.updateMany(
      { likedPosts: { $in: postIds } },
      { $pull: { likedPosts: { $in: postIds } } },
    );

    // 3. Remove user from others' following/followers lists
    await User.updateMany(
      { $or: [{ followers: userId }, { following: userId }] },
      { $pull: { followers: userId, following: userId } },
    );

    // 4. Remove all likes by this user
    await Post.updateMany({ likes: userId }, { $pull: { likes: userId } });

    // 5. Delete the user
    await User.findByIdAndDelete(userId);
    res.cookie('jwt', '', { maxAge: 0 }); // Clear cookie

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.log('Error in deleteUser:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
