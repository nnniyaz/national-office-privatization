import {SystemActionCreator} from "./system/action-creator.ts";
import {ApplicationActionCreator} from "./application/action-creator.ts";
import {UserActionCreator} from "./user/action-creator.ts";
import {ContactsActionCreator} from "./contacts/action-creator.ts";
import {DocumentActionCreator} from "./document/action-creator.ts";
import {EmployeeActionCreator} from "./employee/action-creator.ts";
import {EnterpriseActionCreator} from "./enterprise/action-creator.ts";
import {EventActionCreator} from "./event/action-creator.ts";
import {MissionActionCreator} from "./mission/action-creator.ts";
import {NewsActionCreator} from "./news/action-creator.ts";
import {NpaActionCreator} from "./npa/action-creator.ts";
import {PartnerActionCreator} from "./partner/action-creator.ts";
import {AuthActionCreator} from "./auth/action-creator.ts";
import {UploadActionCreator} from "./upload/action-creator.ts";

export const allActionCreators = {
    ...SystemActionCreator,
    ...UserActionCreator,
    ...ApplicationActionCreator,
    ...ContactsActionCreator,
    ...DocumentActionCreator,
    ...EmployeeActionCreator,
    ...EnterpriseActionCreator,
    ...EventActionCreator,
    ...MissionActionCreator,
    ...NewsActionCreator,
    ...NpaActionCreator,
    ...PartnerActionCreator,
    ...AuthActionCreator,
    ...UploadActionCreator
}
