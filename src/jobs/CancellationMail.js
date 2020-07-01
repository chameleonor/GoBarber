// import { format } from 'date-fns';
// import enUS from 'date-fns/locale/en-US';
import Mail from '../lib/Mail';

class CancellationMail {
  get key() {
    /**
     *  podemos concatenar uma string de constant + uuid por exemplo para ter um identificador unico
     */
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { appointment } = data;

    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Canceled Appointment',
      text: 'Your appointment has been canceled'
    });
  }
}

export default new CancellationMail();
