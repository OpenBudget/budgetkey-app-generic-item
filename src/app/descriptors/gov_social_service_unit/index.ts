import { GovUnitDescriptor } from '../../model';

export default new GovUnitDescriptor({
  pathPrefix: 'units/gov_social_service_unit/.+',
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
