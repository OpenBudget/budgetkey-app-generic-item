import { SimpleDescriptor } from '../../../model';

export default new SimpleDescriptor({
  pathPrefix: 'org/association/',
  titleTemplate: require('../title-template.html'),
  preTitleTemplate: require('../pretitle-template.html'),
  amountTemplate: require('../amount-template.html'),
  subtitleTemplate: require('./subtitle-template.html'),
  questions: require('../questions.json'),
  textTemplate: require('./text-template.html')
});
