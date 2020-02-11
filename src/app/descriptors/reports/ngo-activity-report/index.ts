import { ReportDescriptor, Indicator } from '../../../model';

const activeTooltip = 'ארגון מוגדר כפעיל אם הוצג עבורו דיווח שנתי באתר "גיידסטאר" באחת משלוש השנים האחרונות.';

export default new ReportDescriptor({
  pathPrefix: 'reports/ngo-activity-report/',
  titlePrefix: `ארגונים
  הפעילים<span class='bk-tooltip-anchor'><img src='assets/img/help.svg'><span class='bk-tooltip'>${activeTooltip}</span></span>
   בתחום`,
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
      'icon-coins.svg',
      require('./indicator-coins.html')
    ),
  ],
  suffixTemplate: require('./suffix-template.html'),
  questions: require('./questions.json')
});
