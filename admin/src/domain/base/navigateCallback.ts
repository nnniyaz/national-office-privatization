import {NavigateFunction} from "react-router-dom";
import {RouteNames} from "../../pages";

export type NavigateCallback = {
    navigate: NavigateFunction;
    to?: RouteNames;
}
