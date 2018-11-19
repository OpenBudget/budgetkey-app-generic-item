import { OrgDescriptor } from '../../../model';

export default new OrgDescriptor({
  pathPrefix: 'org/association/',
  titleTemplate: require('../title-template.html'),
  preTitleTemplate: require('../pretitle-template.html'),
  amountTemplate: require('./amount-template.html'),
  subtitleTemplate: require('./subtitle-template.html'),
  questions: require('../questions.json'),
  textTemplate: require('./text-template.html'),
  visualizationTemplates: {
    org_status: require('./org-status.html'),
    org_credentials: require('./org-credentials.html'),
  }
});
