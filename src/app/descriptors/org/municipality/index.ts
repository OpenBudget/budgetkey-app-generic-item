import { MuniDescriptor } from '../../../model';

export default new MuniDescriptor({
  pathPrefix: 'org/municipality',
  titleTemplate: require('../title-template.html'),
  preTitleTemplate: require('../pretitle-template.html'),
  amountTemplate: require('../amount-template.html'),
  subtitleTemplate: require('./subtitle-template.html'),
  questions: require('../questions.json'),
  textTemplate: require('./text-template.html')
});
