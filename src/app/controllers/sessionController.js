import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/user';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .min(6)
        .required()
    });

    const isValidReqBody = await schema.isValid(req.body);

    if (!isValidReqBody) res.status(400).json({ error: 'Validation fails' });

    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      // 401 - nao autorizado
      return res.status(401).json({ error: 'e-mail do not exists.' });
    }

    const isValidPassword = !(await user.checkPassword(password));

    if (isValidPassword) {
      return res.status(401).json({ error: 'password does not match.' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresInd
      })
    });
  }
}

export default new SessionController();
