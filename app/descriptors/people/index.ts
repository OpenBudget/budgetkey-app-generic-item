import {PeopleDescriptor} from '../../model/';

export default new PeopleDescriptor({
  pathPrefix: 'people',
  questions: require('./questions.json')
});
