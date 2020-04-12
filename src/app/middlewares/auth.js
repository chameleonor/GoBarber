import jwt from 'jsonwebtoken';
import { promisify } from 'util'; // util e padrao do node
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: 'Token not provided!'
    });
  }

  // ['Bearer', 'token'] => descarta a primeira posicao e mantem somente a segunda
  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(
      jwt.verify /*
      metodo que ser transformado em async/await
      retorna uma funcao que sera novamente excutada passando os parametros
      */
    )(token, authConfig.secret);
    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).json({
      error: 'Invalid Token!'
    });
  }
};
