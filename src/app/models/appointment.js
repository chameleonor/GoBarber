import Sequelize, { Model } from 'sequelize';

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE
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
  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.File, { foreignKey: 'provider_id', as: 'provider' });
  }
}

export default Appointment;
