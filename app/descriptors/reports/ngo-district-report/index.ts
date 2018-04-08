import { ReportDescriptor, Indicator } from '../../../model';

export default new ReportDescriptor({
  pathPrefix: 'reports/ngo-district-report/',
  titleTemplate: require('./title-template.html'),
  indicators: [
    new Indicator(
      'icon-shetach.svg',
      require('./indicator-shetach.html')
    ),
    new Indicator(
      'icon-madad.svg',
      require('./indicator-madad.html')
    ),
    new Indicator(
      'icon-toshavim.svg',
      require('./indicator-toshavim.html')
    ),
  ],
  suffixTemplate: require('./suffix-template.html'),
  questions: require('./questions.json')
});
