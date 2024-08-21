import {LoadingOutlined} from "@ant-design/icons";

export default function Loading() {
    return (
        <div className={"loader"}>
            <LoadingOutlined style={{
                fontSize: "50px"
            }}/>
        </div>
    )
}
