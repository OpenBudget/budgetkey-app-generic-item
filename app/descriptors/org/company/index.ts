import { OrgDescriptor } from '../../../model';

export default new OrgDescriptor({
  pathPrefix: 'org/company/',
  titleTemplate: require('../title-template.html'),
  preTitleTemplate: require('../pretitle-template.html'),
  amountTemplate: require('./amount-template.html'),
  subtitleTemplate: require('./subtitle-template.html'),
  questions: require('../questions.json'),
  textTemplate: require('./text-template.html'),
  visualizationTemplates: {
    org_status: require('./org-status.html'),
  },
  tips: [
    require('./generic.html'),
    require('./registrar.html'),
    require('./fix_details.html'),
  ]
});
