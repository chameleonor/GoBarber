import * as Yup from 'yup';
import { startOfDay, parseISO, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/appointment';
import User from '../models/user';

class ScheduleController {
  async index(req, res) {
    const schema = Yup.object().shape({
      date: Yup.date().required()
    });

    if (!(await schema.isValid(req.query)))
      return res.status(400).json({ error: 'Validation fails' });

    try {
      const checkUserProvider = await User.findOne({
        where: {
          id: req.userId,
          provider: true
        }
      });

      if (!checkUserProvider)
        return res.status(400).json({ error: 'User is not a provider.' });
    } catch (error) {
      return res.status(500).json({ error });
    }

    const { date, page = 1 } = req.query;

    const parsedDate = parseISO(date);

    try {
      const appointment = await Appointment.findAll({
        where: {
          provider_id: req.userId,
          canceled_at: null,
          date: {
            [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)]
          }
        },
        limit: 20,
        offset: (page - 1) * 20,
        order: ['date']
      });
      return res.json(appointment);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
}

export default new ScheduleController();
