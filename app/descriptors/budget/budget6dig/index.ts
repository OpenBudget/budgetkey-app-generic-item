export default {
  pathPrefix: 'budget/00[0-9]{6}/',
  titleTemplate: require('../title-template.html'),
  preTitleTemplate: require('./pretitle-template.html'),
  amountTemplate: require('../amount-template.html'),
  subtitleTemplate: require('./subtitle-template.html'),
  textTemplate: require('./text-template.html'),
  questions: require('./questions.json')
};
