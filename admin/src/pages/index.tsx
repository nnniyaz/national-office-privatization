import React from "react";
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import {MlString} from "../domain/base/mlString.ts";
import {txts} from "../shared/core/i18ngen";
import {useTypedSelector} from "../shared/hooks/useTypedSelector.ts";
import Login from "./Login/Login.tsx";
import User from "./User/User.tsx";
import Partner from "./Partner/Partner.tsx";
import Enterprise from "./Enterprise/Enterprise.tsx";
import Mission from "./Mission/Mission.tsx";
import Employee from "./Employee/Employee.tsx";
import NPA from "./NPA/NPA.tsx";
import Contacts from "./Contacts/Contacts.tsx";
import News from "./News/News.tsx";
import Event from "./Event/Event.tsx";
import Document from "./Document/Document.tsx";
import Layout from "../shared/ui/Layout/Layout.tsx";
import UserCreate from "./User/pages/UserCreate/UserCreate.tsx";
import UserEdit from "./User/pages/UserEdit/UserEdit.tsx";
import PartnerCreate from "./Partner/pages/PartnerCreate/PartnerCreate.tsx";
import PartnerEdit from "./Partner/pages/PartnerEdit/PartnerEdit.tsx";
import EnterpriseCreate from "./Enterprise/pages/EnterpriseCreate/EnterpriseCreate.tsx";
import EnterpriseEdit from "./Enterprise/pages/EnterpriseEdit/EnterpriseEdit.tsx";
import MissionCreate from "./Mission/pages/MissionCreate/MissionCreate.tsx";
import MissionEdit from "./Mission/pages/MissionEdit/MissionEdit.tsx";
import EmployeeCreate from "./Employee/pages/EmployeeCreate/EmployeeCreate.tsx";
import EmployeeEdit from "./Employee/pages/EmployeeEdit/EmployeeEdit.tsx";
import NpaCreate from "./NPA/pages/NPACreate/NPACreate.tsx";
import NpaEdit from "./NPA/pages/NPAEdit/NPAEdit.tsx";
import ContactsEdit from "./Contacts/pages/ContactsEdit/ContactsEdit.tsx";
import ContactsCreate from "./Contacts/pages/ContactsCreate/ContactsCreate.tsx";
import NewsCreate from "./News/pages/NewsCreate/NewsCreate.tsx";
import NewsEdit from "./News/pages/NewsEdit/NewsEdit.tsx";
import EventCreate from "./Event/pages/EventCreate/EventCreate.tsx";
import EventEdit from "./Event/pages/EventEdit/EventEdit.tsx";
import DocumentCreate from "./Document/pages/DocumentCreate/DocumentCreate.tsx";
import DocumentEdit from "./Document/pages/DocumentEdit/DocumentEdit.tsx";
import Application from "./Application/Application.tsx";
import ApplicationEdit from "./Application/pages/ApplicationEdit/ApplicationEdit.tsx";
import Settings from "./Settings/Settings.tsx";

export interface IRoute {
    title: MlString
    path: string
    element: React.ReactNode
    availableRoles?: string[]
    disabled?: boolean
}

export enum RouteNames {
    LOGIN = '/login',

    APPLICATIONS = '/applications',
    APPLICATION_EDIT = '/applications/edit/:id',

    USERS = '/users',
    USER_CREATE = '/users/create',
    USER_EDIT = '/users/edit/:id',

    // Main
    PARTNERS = '/partners',
    PARTNER_CREATE = '/partners/create',
    PARTNER_EDIT = '/partners/edit/:id',

    // Catalog
    ENTERPRISE = '/enterprise',
    ENTERPRISE_CREATE = '/enterprise/create',
    ENTERPRISE_EDIT = '/enterprise/edit/:id',

    // About us
    MISSION = '/mission',
    MISSION_CREATE = '/mission/create',
    MISSION_EDIT = '/mission/edit/:id',
    EMPLOYEES = '/employees',
    EMPLOYEE_CREATE = '/employees/create',
    EMPLOYEE_EDIT = '/employees/edit/:id',
    NPA = '/npa',
    NPA_CREATE = '/npa/create',
    NPA_EDIT = '/npa/edit/:id',
    CONTACTS = '/contacts',
    CONTACTS_CREATE = '/contacts/create',
    CONTACTS_EDIT = '/contacts/edit/:id',

    // Media
    NEWS = '/news',
    NEWS_CREATE = '/news/create',
    NEWS_EDIT = '/news/edit/:id',
    EVENTS = '/events',
    EVENTS_CREATE = '/events/create',
    EVENTS_EDIT = '/events/edit/:id',
    DOCUMENTS = '/documents',
    DOCUMENTS_CREATE = '/documents/create',
    DOCUMENTS_EDIT = '/documents/edit/:id',

    SETTINGS = '/settings',
}

export const publicRoutes: IRoute[] = [
    {path: RouteNames.LOGIN, title: txts.login, element: <Login/>},
]

export const privateSidebarRoutes: IRoute[] = [
    {path: RouteNames.APPLICATIONS, title: txts.applications, element: <Application/>},
    {path: RouteNames.USERS, title: txts.users, element: <User/>, availableRoles: ["admin"]},
    {path: RouteNames.PARTNERS, title: txts.partners, element: <Partner/>},
    {path: RouteNames.ENTERPRISE, title: txts.enterprise, element: <Enterprise/>},
    {path: RouteNames.MISSION, title: txts.mission, element: <Mission/>},
    {path: RouteNames.EMPLOYEES, title: txts.employees, element: <Employee/>},
    {path: RouteNames.NPA, title: txts.npa, element: <NPA/>},
    {path: RouteNames.CONTACTS, title: txts.contacts, element: <Contacts/>},
    {path: RouteNames.NEWS, title: txts.news, element: <News/>},
    {path: RouteNames.EVENTS, title: txts.events, element: <Event/>},
    {path: RouteNames.DOCUMENTS, title: txts.documents, element: <Document/>},
    {path: RouteNames.SETTINGS, title: txts.settings, element: <Settings/>},
]

export const privateRoutes: IRoute[] = [
    {path: RouteNames.APPLICATION_EDIT, title: txts.applications_edit, element: <ApplicationEdit/>},
    {path: RouteNames.USER_CREATE, title: txts.users_create, element: <UserCreate/>, availableRoles: ["admin"]},
    {path: RouteNames.USER_EDIT, title: txts.users_edit, element: <UserEdit/>, availableRoles: ["admin"]},
    {path: RouteNames.PARTNER_CREATE, title: txts.partners_create, element: <PartnerCreate/>},
    {path: RouteNames.PARTNER_EDIT, title: txts.partners_edit, element: <PartnerEdit/>},
    {path: RouteNames.ENTERPRISE_CREATE, title: txts.enterprise_create, element: <EnterpriseCreate/>},
    {path: RouteNames.ENTERPRISE_EDIT, title: txts.enterprise_edit, element: <EnterpriseEdit/>},
    {path: RouteNames.MISSION_CREATE, title: txts.mission_create, element: <MissionCreate/>},
    {path: RouteNames.MISSION_EDIT, title: txts.mission_edit, element: <MissionEdit/>},
    {path: RouteNames.EMPLOYEE_CREATE, title: txts.employees_create, element: <EmployeeCreate/>},
    {path: RouteNames.EMPLOYEE_EDIT, title: txts.employees_edit, element: <EmployeeEdit/>},
    {path: RouteNames.NPA_CREATE, title: txts.npa_create, element: <NpaCreate/>},
    {path: RouteNames.NPA_EDIT, title: txts.npa_edit, element: <NpaEdit/>},
    {path: RouteNames.CONTACTS_CREATE, title: txts.contacts_create, element: <ContactsCreate/>},
    {path: RouteNames.CONTACTS_EDIT, title: txts.contacts_edit, element: <ContactsEdit/>},
    {path: RouteNames.NEWS_CREATE, title: txts.news_create, element: <NewsCreate/>},
    {path: RouteNames.NEWS_EDIT, title: txts.news_edit, element: <NewsEdit/>},
    {path: RouteNames.EVENTS_CREATE, title: txts.events_create, element: <EventCreate/>},
    {path: RouteNames.EVENTS_EDIT, title: txts.events_edit, element: <EventEdit/>},
    {path: RouteNames.DOCUMENTS_CREATE, title: txts.documents_create, element: <DocumentCreate/>},
    {path: RouteNames.DOCUMENTS_EDIT, title: txts.documents_edit, element: <DocumentEdit/>},
]

export default function Router() {
    const location = useLocation();
    const {isAuth} = useTypedSelector(state => state.auth);
    const [lastLocation] = React.useState<string>(localStorage.getItem('nop-last-location') || RouteNames.APPLICATIONS);

    window.onbeforeunload = () => {
        localStorage.setItem('nop-last-location', location.pathname);
    }

    return (
        <Routes>
            {
                isAuth
                    ?
                    <Route element={<Layout/>}>
                        {[...privateSidebarRoutes, ...privateRoutes].map(route => (
                            <Route key={route.path} path={route.path} element={route.element}/>
                        ))}
                        <Route path={"*"} element={<Navigate to={lastLocation}/>}/>
                    </Route>
                    :
                    <Route>
                        {publicRoutes.map(route => (
                            <Route key={route.path} path={route.path} element={route.element}/>
                        ))}
                        <Route path={"*"} element={<Navigate to={RouteNames.LOGIN}/>}/>
                    </Route>
            }
        </Routes>
    )
}
