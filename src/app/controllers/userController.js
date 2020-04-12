import * as Yup from 'yup';

import User from '../models/user';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .min(10)
        .max(20)
        .required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .min(6)
        .max(20)
        .required()
    });

    const isValidReqBody = await schema.isValid(req.body);

    if (!isValidReqBody)
      return res.status(400).json({ error: 'Validation fails' });

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const { id, name, email, provider } = await User.create(req.body);
    return res.json({ id, name, email, provider });
  }

  async update(req, res) {
    // update
    // 1 retorna os dados do usuario ja logado
    // 2 compara se o email atual é diferente do digitado
    // 3 compara se o email novo ja existe
    // 4 compara se realmente digitou uma senha antiga, significa que a senha será alterada
    // 5 compara se a senha digitada bate com a senha hash
    // 6 atualiza usuario

    const schema = Yup.object().shape({
      name: Yup.string()
        .min(10)
        .max(20),
      email: Yup.string().email(),
      oldPassword: Yup.string()
        .min(6)
        .max(20),
      password: Yup.string()
        .min(6)
        .max(20)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string()
        .min(6)
        .max(20)
        .when('password', (password, field) =>
          password ? field.required().oneOf([Yup.ref('password')]) : field
        )
    });

    const isValidReqBody = await schema.isValid(req.body);

    if (!isValidReqBody)
      return res.status(400).json({ error: 'Validation fails' });

    const { email, oldPassword } = req.body;

    try {
      const user = await User.findByPk(req.userId);

      if (email && email !== user.email) {
        const userExists = await User.findOne({ where: { email } });

        if (userExists) {
          return res.status(400).json({ error: 'User already exists.' });
        }
      }

      const isValidPassword =
        oldPassword && !(await user.checkPassword(oldPassword));

      // verifica se oldPassword foi preenchido
      // para saber se o usuario realmente quer alterar a senha
      if (isValidPassword) {
        return res.status(401).json({ error: 'Password does not match.' }); // se diferente, retorna
      }

      const { id, name, email: newEmail, avatar_id } = await user.update(
        req.body
      );

      return res.json({ id, name, email: newEmail, avatar_id });
    } catch (error) {
      console.log('error: ', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }
}

export default new UserController();
