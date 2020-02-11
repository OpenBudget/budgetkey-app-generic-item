import { ReportDescriptor, Indicator } from '../../../model';

const activeTooltip = 'ארגון מוגדר כפעיל אם הוצג עבורו דיווח שנתי באתר "גיידסטאר" באחת משלוש השנים האחרונות.';

export default new ReportDescriptor({
  pathPrefix: 'reports/ngo-district-report/',
  titlePrefix: `ארגונים
  הפעילים<span class='bk-tooltip-anchor'><img src='assets/img/help.svg'><span class='bk-tooltip'>${activeTooltip}</span></span>
   במחוז`,
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
