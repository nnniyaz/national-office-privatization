import About from "@components/About/About";
import {Langs} from "@domain/base/mlString/mlString";

export default function AboutParent() {
    return <About lang={Langs.EN}/>
}
