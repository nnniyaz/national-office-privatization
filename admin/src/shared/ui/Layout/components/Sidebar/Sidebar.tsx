import React, {FC, FunctionComponent, useEffect, useRef, useState} from "react";
import {Transition, TransitionStatus} from "react-transition-group";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {MenuFoldOutlined} from "@ant-design/icons";
import {IRoute, RouteNames, privateSidebarRoutes} from "../../../../../pages";
import {txts} from "../../../../core/i18ngen.ts";
import {useActions} from "../../../../hooks/useActions";
import {useTypedSelector} from "../../../../hooks/useTypedSelector";
import classes from "./Sidebar.module.scss";
import {Divider} from "antd";

const useOutsideDetecter = (ref: React.MutableRefObject<any>, setIsShown: React.Dispatch<boolean>) => {
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsShown(false);
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}

const OutsideDetecter: FunctionComponent<{ children: React.ReactNode, setIsShown: React.Dispatch<boolean> }> = (
    {children, setIsShown}
) => {
    const wrapperRef = useRef(null);
    useOutsideDetecter(wrapperRef, setIsShown);
    return <div style={{width: "100%"}} ref={wrapperRef}>{children}</div>;
}

interface HeaderProps {
    isShown: boolean;
    setIsShown: React.Dispatch<React.SetStateAction<boolean>>
}

const logoutSideBarItem: IRoute = {
    title: txts.logout,
    path: "" as RouteNames,
    element: <></> as any
}

export const Sidebar: FC<HeaderProps> = ({isShown, setIsShown}) => {
    const navigate = useNavigate();
    const upperSlice = privateSidebarRoutes.filter(item => item.path !== RouteNames.SETTINGS);
    const lowerSlice = privateSidebarRoutes.filter(item => item.path === RouteNames.SETTINGS);
    const {logout} = useActions();

    const [windowSize, setWindowSize] = useState(window.innerWidth);

    const transitionClasses: Record<TransitionStatus, string> = {
        entering: classes.sidebar__enter__active,
        entered: classes.sidebar__enter__done,
        exiting: classes.sidebar__exit__active,
        exited: classes.sidebar__exit__done,
        unmounted: classes.sidebar__exit__done,
    }

    const handleOnClick = () => {
        setIsShown(false);
    }

    const handleLogout = async () => {
        logout({navigate});
    }

    useEffect(() => {
        const handleWindowResize = () => setWindowSize(window.innerWidth);
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    if (windowSize <= 1340) {
        return (
            <Transition in={isShown} timeout={300} mountOnEnter unmountOnExit>
                {state => (
                    <div className={`${classes.sidebar} ${transitionClasses[state]}`}>
                        <OutsideDetecter setIsShown={setIsShown}>
                            <div className={classes.sidebar__header}>
                                <MenuFoldOutlined className={classes.burger} onClick={() => setIsShown(false)}/>
                            </div>
                            <Divider/>
                            {upperSlice.map((item) =>
                                <SideBarItem item={item} onClick={handleOnClick} key={item.path}/>
                            )}
                            <Divider/>
                            {lowerSlice.map((item) =>
                                <SideBarItem item={item} onClick={handleOnClick} key={item.path}/>
                            )}
                            <SideBarItem item={logoutSideBarItem} onClick={handleLogout}/>
                        </OutsideDetecter>
                    </div>
                )}
            </Transition>
        )
    }

    return (
        <div className={classes.sidebar}>
            <div className={classes.sidebar__header}>
                <MenuFoldOutlined className={classes.burger} onClick={() => setIsShown(false)}/>
            </div>
            {upperSlice.map((item) => <SideBarItem item={item} onClick={handleOnClick} key={item.path}/>)}
            <Divider/>
            {lowerSlice.map((item) => <SideBarItem item={item} onClick={handleOnClick} key={item.path}/>)}
            <SideBarItem item={logoutSideBarItem} onClick={handleLogout}/>
        </div>
    )
}

const SideBarItem: FC<{ item: IRoute, onClick: (...args: any[]) => void }> = ({item, onClick}) => {
    const {lang} = useTypedSelector(state => state.system);
    const location = useLocation();
    const activeLink = (path: string) => {
        if (!path) return false;
        if (path === "/") {
            return path === location.pathname;
        }
        return location.pathname.includes(path);
    }

    return (
        <NavLink
            to={item.path}
            onClick={onClick}
            className={activeLink(item.path) ? classes.sidebar__item__active : classes.sidebar__item}
            style={{pointerEvents: item.disabled ? "none" : "auto", opacity: item.disabled ? .5 : 1}}
        >
            <p className={classes.sidebar__item__text}>
                {item?.title?.[lang]}
            </p>
        </NavLink>
    )
}
