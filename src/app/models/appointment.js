import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date());
          }
        },
        cancelable: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(new Date(), subHours(this.date, 2));
          }
        }
      },
      {
        sequelize
      }
    );
    return this;
  }

  // esse campo e gerado automaticamente quando fazemos o relacionamento entre
  // as tabelas, sem a necessidade de criar um campo no schema
  // e como as tabelas fazem joins
  // obs: quando temos dois relacionamentos com uma tabela, e obrigatorio ter dois apelidos
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

export default Appointment;
