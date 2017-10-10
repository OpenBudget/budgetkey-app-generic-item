'use strict';

import descriptorOrgCompany from './org/company';
import descriptorBudget2Dig from './budget/budget2dig';
import descriptorBudget4Dig from './budget/budget4dig';
import descriptorBudget6Dig from './budget/budget6dig';
import descriptorBudget8Dig from './budget/budget8dig';
import {Descriptor} from '../model/descriptor';

let descriptors: Descriptor[] = [
  descriptorOrgCompany,
  descriptorBudget2Dig,
  descriptorBudget4Dig,
  descriptorBudget6Dig,
  descriptorBudget8Dig,
];

export default descriptors;
