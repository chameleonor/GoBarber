import Bee from 'bee-queue';
import CancellationMail from '../jobs/CancellationMail';
import redis from '../config/redis';

const jobs = [CancellationMail];

class Queue {
  constructor() {
    this.queues = {}; // cada background job tera sua propria fila

    this.init();
  }

  init() {
    // podemos utilizar os metodos da classe atraves do destruct
    // pois os metodos sao "atributos"
    jobs.forEach(({ key, handle }) => {
      try {
        const bee = new Bee(key, { redis });
        this.queues[key] = {
          bee,
          handle
        };
      } catch (error) {
        console.log('Erro ao iniciar fila -> ', error);
      }
    });
  }

  add(queue, job) {
    return this.queues[queue].bee
      .createJob(job)
      .timeout(3000)
      .retries(2)
      .save()
      .then(result => {
        // job enqueued, job.id populated
        console.log('job was added -> ', result);
      })
      .catch(error => {
        console.log('Erro ao criar job-> ', error);
      });
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];
      bee
        .on('ready', () => {
          console.log('queue now ready to start doing things');
        })
        .on('failed', this.handleProcessFailed)
        .process(handle);
    });
  }

  handleProcessFailed(job, err) {
    console.log(`Queue Failed: ${job.queue.name}: ${err}`);
  }
}

export default new Queue();
