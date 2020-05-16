import Notification from '../schemas/notification';
import User from '../models/user';

class NotificationController {
  async index(req, res) {
    try {
      const checkIsProvider = await User.findOne({
        where: {
          id: req.userId,
          provider: true
        }
      });

      if (!checkIsProvider)
        return res.status(400).json({ error: 'Cant load the notification.' });
    } catch (error) {
      return res.status(500).json({ error });
    }

    const notifications = await Notification.find({
      user: req.userId
    })
      .sort({
        createdAt: 'desc'
      })
      .limit(20);

    return res.json(notifications);
  }

  async update(req, res) {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (notification) res.status(200).json({ message: 'Notification updated' });

    res.status(500).json({ message: 'Internal server error.' });
  }
}

export default new NotificationController();
