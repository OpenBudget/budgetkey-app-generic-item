import { ProcureDescriptor } from '../../../model';

export default new ProcureDescriptor({
  pathPrefix: 'muni_tenders/office',
  questions: require('./questions.json')
});
