import { ReportDescriptor, Indicator } from '../../../model';

export default new ReportDescriptor({
  pathPrefix: 'reports/ngo-activity-report/',
  titleTemplate: require('./title-template.html'),
  indicators: [
    new Indicator(
      'icon-hadash.svg',
      require('./indicator-hadash.html')
    ),
    new Indicator(
      'icon-ovdim.svg',
      require('./indicator-ovdim.html')
    ),
    new Indicator(
      'icon-shnati.svg',
      require('./indicator-shnati.html')
    ),
    new Indicator(
      'icon-semel.svg',
      require('./indicator-semel.html')
    ),
  ],
  questions: require('./questions.json')
});
