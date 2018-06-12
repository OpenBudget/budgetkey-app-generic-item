import { ProcureDescriptor } from '../../../model';

export default new ProcureDescriptor({
  pathPrefix: 'tenders/office',
  questions: require('./questions.json')
});
