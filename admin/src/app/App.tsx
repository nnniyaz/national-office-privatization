import Router from "../pages";
import './App.scss'
import {useActions} from "../shared/hooks/useActions.ts";
import React, {useEffect, useMemo} from "react";
import {LoadingOutlined} from "@ant-design/icons";
import {useTypedSelector} from "../shared/hooks/useTypedSelector.ts";
import {notification} from "antd";

const Context = React.createContext({name: 'Default'});

function App() {
    const {isLoadingCurrentUser} = useTypedSelector(state => state.auth);
    const {getCurrentUser, setNotificationApi} = useActions();
    const [api, contextHolder] = notification.useNotification();

    const contextValue = useMemo(() => ({name: 'Ant Design'}), []);

    useEffect(() => {
        getCurrentUser();
        setNotificationApi(api);
    }, []);

    if (isLoadingCurrentUser) {
        return (
            <div style={{
                width: "100%",
                height: "100dvh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <LoadingOutlined style={{fontSize: "40px"}}/>
            </div>
        )
    }

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}
            <Router/>
        </Context.Provider>
    )
}

export default App
