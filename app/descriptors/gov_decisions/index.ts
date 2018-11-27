import { SimpleDescriptor } from '../../model';

export default new SimpleDescriptor({
  pathPrefix: 'gov_decisions/.+',
  titleTemplate: require('./title-template.html'),
  preTitleTemplate: require('./pretitle-template.html'),
  amountTemplate: '',
  subtitleTemplate: require('./subtitle-template.html'),
  textTemplate: require('./text-template.html'),
  questions: []
});
