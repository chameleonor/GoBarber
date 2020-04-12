import User from '../models/user';
import File from '../models/file';

class ProviderController {
  async index(req, res) {
    try {
      const providers = await User.findAll({
        where: {
          provider: true
        },
        attributes: ['id', 'name', 'email'],
        include: [
          {
            model: File,
            as: 'avatar',
            attributes: ['name', 'path', 'url']
          }
        ]
      });

      return res.status(200).json(providers);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}

export default new ProviderController();
