import { MuniBudgetDescriptor } from '../../model';

export default new MuniBudgetDescriptor({
  pathPrefix: 'muni_budgets/',
  questions: require('./questions.json')
});
