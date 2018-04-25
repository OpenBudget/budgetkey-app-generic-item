import { ReportDescriptor, Indicator } from '../../../model';

export default new ReportDescriptor({
  pathPrefix: 'reports/ngo-activity-report/',
  titlePrefix: 'ארגונים הפעילים בתחום',
  titleSuffix: 'בכל הארץ',
  titleField: 'field_of_activity_display',
  titleOtherURLPrefix: 'reports/ngo-activity-report/',
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
  suffixTemplate: require('./suffix-template.html'),
  questions: require('./questions.json')
});
