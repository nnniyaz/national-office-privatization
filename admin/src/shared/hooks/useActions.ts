import {bindActionCreators} from "redux";
import {useDispatch} from "react-redux";
import {allActionCreators} from "../../app/store/reducers/action-creators.ts";

export const useActions = () => {
    const dispatch = useDispatch();
    return bindActionCreators(allActionCreators, dispatch);
}
