import { ReportDescriptor, Indicator } from '../../../model';

export default new ReportDescriptor({
  pathPrefix: 'reports/ngo-district-report/',
  titlePrefix: 'ארגונים הפעילים במחוז',
  titleSuffix: '',
  titleField: 'district',
  titleOtherURLPrefix: 'reports/ngo-district-report/',
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
