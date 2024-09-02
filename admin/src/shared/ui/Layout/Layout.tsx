import classes from "./Layout.module.scss";
import {Sidebar} from "./components/Sidebar";
import {useState, useEffect} from "react";
import {Link, Outlet, useLocation} from "react-router-dom";
import {MenuUnfoldOutlined} from "@ant-design/icons";
import {IRoute, privateRoutes, privateSidebarRoutes, RouteNames} from "../../../pages";
import {useTypedSelector} from "../../hooks/useTypedSelector.ts";
import {Breadcrumb} from "antd";
import {useActions} from "../../hooks/useActions.ts";

export default function Layout() {
    const location = useLocation();
    const {lang, breadcrumbs} = useTypedSelector(state => state.system);
    const {setBreadcrumbs} = useActions();
    const [isShown, setIsShown] = useState<boolean>(true);
    const currentRoute = [...privateRoutes, ...privateSidebarRoutes].find(route => {
        let path = route.path;
        let locationPath = location.pathname;
        if (route.path.includes("edit")) {
            path = route.path.split("/:id")[0];
        }
        if (location.pathname.includes("edit")) {
            locationPath = location.pathname.split("/edit")[0] + "/edit";
        }
        return path === locationPath;
    });

    useEffect(() => {
        const routes = [...privateRoutes, ...privateSidebarRoutes];
        let breadcrumbs: IRoute[] = [];
        breadcrumbs.push(routes.find(route => route.path === currentRoute?.path) || {} as IRoute);

        if (location.pathname === RouteNames.USER_CREATE) {
            breadcrumbs = [];
            breadcrumbs.push(routes.find(route => route.path === RouteNames.USERS) || {} as IRoute);
            breadcrumbs.push(routes.find(route => route.path === RouteNames.USER_CREATE) || {} as IRoute);
        } else if (location.pathname.includes(RouteNames.USER_EDIT.replace("/:id", ""))) {
            breadcrumbs = [];
            breadcrumbs.push(routes.find(route => route.path === RouteNames.USERS) || {} as IRoute);
            breadcrumbs.push({
                ...(routes.find(route => route.path === RouteNames.USER_EDIT) || {} as IRoute),
                path: location.pathname
            });
        } else if (location.pathname === RouteNames.PARTNER_CREATE) {
            breadcrumbs = [];
            breadcrumbs.push(routes.find(route => route.path === RouteNames.PARTNERS) || {} as IRoute);
            breadcrumbs.push(routes.find(route => route.path === RouteNames.PARTNER_CREATE) || {} as IRoute);
        } else if (location.pathname.includes(RouteNames.PARTNER_EDIT.replace("/:id", ""))) {
            breadcrumbs = [];
            breadcrumbs.push(routes.find(route => route.path === RouteNames.PARTNERS) || {} as IRoute);
            breadcrumbs.push({
                ...(routes.find(route => route.path === RouteNames.PARTNER_EDIT) || {} as IRoute),
                path: location.pathname
            });
        } else if (location.pathname === RouteNames.ENTERPRISE_CREATE) {
            breadcrumbs = [];
            breadcrumbs.push(routes.find(route => route.path === RouteNames.ENTERPRISE) || {} as IRoute);
            breadcrumbs.push(routes.find(route => route.path === RouteNames.ENTERPRISE_CREATE) || {} as IRoute);
        }  else if (location.pathname.includes(RouteNames.ENTERPRISE_EDIT.replace("/:id", ""))) {
            breadcrumbs = [];
            breadcrumbs.push(routes.find(route => route.path === RouteNames.ENTERPRISE) || {} as IRoute);
            breadcrumbs.push({
                ...(routes.find(route => route.path === RouteNames.ENTERPRISE_EDIT) || {} as IRoute),
                path: location.pathname
            });
        } else if (location.pathname === RouteNames.MISSION_CREATE) {
            breadcrumbs = [];
            breadcrumbs.push(routes.find(route => route.path === RouteNames.MISSION) || {} as IRoute);
            breadcrumbs.push(routes.find(route => route.path === RouteNames.MISSION_CREATE) || {} as IRoute);
        } else if (location.pathname.includes(RouteNames.MISSION_EDIT.replace("/:id", ""))) {
            breadcrumbs = [];
            breadcrumbs.push(routes.find(route => route.path === RouteNames.MISSION) || {} as IRoute);
            breadcrumbs.push({
                ...(routes.find(route => route.path === RouteNames.MISSION_EDIT) || {} as IRoute),
                path: location.pathname
            });
        } else if (location.pathname === RouteNames.EMPLOYEE_CREATE) {
            breadcrumbs = [];
            breadcrumbs.push(routes.find(route => route.path === RouteNames.EMPLOYEES) || {} as IRoute);
            breadcrumbs.push(routes.find(route => route.path === RouteNames.EMPLOYEE_CREATE) || {} as IRoute);
        } else if (location.pathname.includes(RouteNames.EMPLOYEE_EDIT.replace("/:id", ""))) {
            breadcrumbs = [];
            breadcrumbs.push(routes.find(route => route.path === RouteNames.EMPLOYEES) || {} as IRoute);
            breadcrumbs.push({
                ...(routes.find(route => route.path === RouteNames.EMPLOYEE_EDIT) || {} as IRoute),
                path: location.pathname
            });
        } else if (location.pathname === RouteNames.NPA_CREATE) {
            breadcrumbs = [];
            breadcrumbs.push(routes.find(route => route.path === RouteNames.NPA) || {} as IRoute);
            breadcrumbs.push(routes.find(route => route.path === RouteNames.NPA_CREATE) || {} as IRoute);
        } else if (location.pathname.includes(RouteNames.NPA_EDIT.replace("/:id", ""))) {
            breadcrumbs = [];
            breadcrumbs.push(routes.find(route => route.path === RouteNames.NPA) || {} as IRoute);
            breadcrumbs.push({
                ...(routes.find(route => route.path === RouteNames.NPA_EDIT) || {} as IRoute),
                path: location.pathname
            });
        } else if (location.pathname === RouteNames.CONTACTS_CREATE) {
            breadcrumbs = [];
            breadcrumbs.push(routes.find(route => route.path === RouteNames.CONTACTS) || {} as IRoute);
            breadcrumbs.push(routes.find(route => route.path === RouteNames.CONTACTS_CREATE) || {} as IRoute);
        } else if (location.pathname.includes(RouteNames.CONTACTS_EDIT.replace("/:id", ""))) {
            breadcrumbs = [];
            breadcrumbs.push(routes.find(route => route.path === RouteNames.CONTACTS) || {} as IRoute);
            breadcrumbs.push({
                ...(routes.find(route => route.path === RouteNames.CONTACTS_EDIT) || {} as IRoute),
                path: location.pathname
            });
        } else if (location.pathname === RouteNames.NEWS_CREATE) {
            breadcrumbs = [];
            breadcrumbs.push(routes.find(route => route.path === RouteNames.NEWS) || {} as IRoute);
            breadcrumbs.push(routes.find(route => route.path === RouteNames.NEWS_CREATE) || {} as IRoute);
        } else if (location.pathname.includes(RouteNames.NEWS_EDIT.replace("/:id", ""))) {
            breadcrumbs = [];
            breadcrumbs.push(routes.find(route => route.path === RouteNames.NEWS) || {} as IRoute);
            breadcrumbs.push({
                ...(routes.find(route => route.path === RouteNames.NEWS_EDIT) || {} as IRoute),
                path: location.pathname
            });
        } else if (location.pathname === RouteNames.EVENTS_CREATE) {
            breadcrumbs = [];
            breadcrumbs.push(routes.find(route => route.path === RouteNames.EVENTS) || {} as IRoute);
            breadcrumbs.push(routes.find(route => route.path === RouteNames.EVENTS_CREATE) || {} as IRoute);
        } else if (location.pathname.includes(RouteNames.EVENTS_EDIT.replace("/:id", ""))) {
            breadcrumbs = [];
            breadcrumbs.push(routes.find(route => route.path === RouteNames.EVENTS) || {} as IRoute);
            breadcrumbs.push({
                ...(routes.find(route => route.path === RouteNames.EVENTS_EDIT) || {} as IRoute),
                path: location.pathname
            });
        } else if (location.pathname === RouteNames.DOCUMENTS_CREATE) {
            breadcrumbs = [];
            breadcrumbs.push(routes.find(route => route.path === RouteNames.DOCUMENTS) || {} as IRoute);
            breadcrumbs.push(routes.find(route => route.path === RouteNames.DOCUMENTS_CREATE) || {} as IRoute);
        } else if (location.pathname.includes(RouteNames.DOCUMENTS_EDIT.replace("/:id", ""))) {
            breadcrumbs = [];
            breadcrumbs.push(routes.find(route => route.path === RouteNames.DOCUMENTS) || {} as IRoute);
            breadcrumbs.push({
                ...(routes.find(route => route.path === RouteNames.DOCUMENTS_EDIT) || {} as IRoute),
                path: location.pathname
            });
        }
        setBreadcrumbs(breadcrumbs);
    }, [location.pathname]);

    return (
        <div className={classes.layout}>
            <Sidebar isShown={isShown} setIsShown={setIsShown}/>
            <div className={classes.layout__content}>
                <div style={{
                    width: "fit-content",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "10px"
                }}>
                    <MenuUnfoldOutlined
                        className={classes.layout__sidebar__btn}
                        onClick={() => setIsShown(!isShown)}
                    />
                    <h2>
                        {[...privateSidebarRoutes, ...privateRoutes].find((route) => {
                            if (location.pathname.includes("edit")) {
                                return route.path.replace("/:id", "") === location.pathname.split("/edit")[0] + "/edit";
                            }
                            return route.path === location.pathname
                        })?.title[lang]}
                    </h2>
                </div>
                <Breadcrumb
                    style={{marginBottom: "20px"}}
                    items={breadcrumbs.map((item, index) => (
                        {
                            title: (
                                <Link
                                    to={item.path}
                                    className={index === breadcrumbs.length - 1 ? classes.breadcrumb__active : classes.breadcrumb}
                                >
                                    {item.title?.[lang]}
                                </Link>
                            )
                        }
                    ))}
                />
                <Outlet/>
            </div>
        </div>
    )
}
