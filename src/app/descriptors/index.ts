'use strict';

import descriptorOrgAssociation from './org/association';
import descriptorOrgCompany from './org/company';
import descriptorOrgMunicipality from './org/municipality';
import descriptorOrg from './org';
import descriptorBudgetFunc from './budget/budgetFunc';
import descriptorBudgetFuncDetail from './budget/budgetFuncDetail';
import descriptorBudget0Dig from './budget/budget0dig';
import descriptorBudget2Dig from './budget/budget2dig';
import descriptorBudget4Dig from './budget/budget4dig';
import descriptorBudget6Dig from './budget/budget6dig';
import descriptorBudget8Dig from './budget/budget8dig';
import descriptorIncome2Dig from './income/income2dig';
import descriptorIncome4Dig from './income/income4dig';
import descriptorIncome6Dig from './income/income6dig';
import descriptorIncome8Dig from './income/income8dig';
import descriptorTendersExemptions from './tenders/exemptions';
import descriptorTendersCentral from './tenders/central';
import descriptorTendersOffice from './tenders/office';
import descriptorCallsForBids from './tenders/calls_for_bids';
import descriptorSupportCriteria from './tenders/support_criteria';
import descriptorContractSpending from './contract-spending';
import descriptorBudgetChanges from './budget-changes';
import descriptorSupports from './supports';
import descriptorReportNGOActivity from './reports/ngo-activity-report';
import descriptorReportNGODistrict from './reports/ngo-district-report';
import descriptorPeople from './people';
import descriptorGovDecisions from './gov_decisions';
import descriptorSocialService from './activities/social_services';
import descriptorGovSocialServiceUnit from './gov_social_service_unit';

import { DescriptorBase } from '../model/descriptor';

const descriptors: DescriptorBase[] = [
  descriptorOrgAssociation,
  descriptorOrgCompany,
  descriptorOrgMunicipality,
  descriptorOrg,
  descriptorBudgetFunc,
  descriptorBudgetFuncDetail,
  descriptorBudget0Dig,
  descriptorBudget2Dig,
  descriptorBudget4Dig,
  descriptorBudget6Dig,
  descriptorBudget8Dig,
  descriptorIncome2Dig,
  descriptorIncome4Dig,
  descriptorIncome6Dig,
  descriptorIncome8Dig,
  descriptorTendersExemptions,
  descriptorTendersCentral,
  descriptorTendersOffice,
  descriptorCallsForBids,
  descriptorSupportCriteria,
  descriptorContractSpending,
  descriptorBudgetChanges,
  descriptorSupports,
  descriptorReportNGOActivity,
  descriptorReportNGODistrict,
  descriptorPeople,
  descriptorGovDecisions,
  descriptorSocialService,
  descriptorGovSocialServiceUnit,
];

export default descriptors;
