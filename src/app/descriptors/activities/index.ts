import { SimpleDescriptor } from '../../model';

export default new SimpleDescriptor({
  pathPrefix: 'activities/.+',
  titleTemplate: require('./title-template.html'),
  preTitleTemplate: require('./pretitle-template.html'),
  amountTemplate: require('./amount-template.html'),
  subtitleTemplate: require('./subtitle-template.html'),
  textTemplate: require('./text-template.html'),
  questions: [],
  visualizationTemplates: {
    table: require('../table.html'),
  },
});
