import Notification from '../models/notification.model.js';

export const getAllNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ to: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'from',
        select: 'username profileImg',
      });

    await Notification.updateMany({ to: userId, read: false }, { read: true });

    res.status(200).json(notifications);
  } catch (error) {
    console.log('Error in getAllNotifications:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const deleteNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ to: req.user._id });
    res.status(200).json({
      success: true,
      message: 'Notifications deleted successfully',
    });
  } catch (error) {
    console.log('Error in deleteNotifications:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const deleteOneNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.to.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: 'You are not allowed to delete this notification' });
    }

    await Notification.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    console.log('Error in deleteOneNotification:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
