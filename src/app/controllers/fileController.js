import File from '../models/file';

// {
//   "fieldname": "file",
//   "originalname": "me2.jpg",
//   "encoding": "7bit",
//   "mimetype": "image/jpeg",
//   "destination": "E:\\Documentos\\projects\\rocketseat\\projetos\\gobarber02\\tmp\\uploads",
//   "filename": "ae56cfd479bc1d80ec786a9291dfe02a.jpg",
//   "path": "E:\\Documentos\\projects\\rocketseat\\projetos\\gobarber02\\tmp\\uploads\\ae56cfd479bc1d80ec786a9291dfe02a.jpg",
//   "size": 44404
// }

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    try {
      const file = await File.create({
        name,
        path
      });

      return res.json(file);
    } catch (error) {
      return res.status(500).json({ error: "can't save the file" });
    }
  }
}

export default new FileController();
