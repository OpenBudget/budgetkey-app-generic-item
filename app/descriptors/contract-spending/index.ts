import { ProcureDescriptor } from '../../model';

export default new ProcureDescriptor({
  pathPrefix: 'contract-spending',
  questions: require('./questions.json')
});
