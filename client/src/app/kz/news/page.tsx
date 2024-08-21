import News from "@components/News/News";

export default function NewsParent({ params }: { params: { id: string }}) {
    return <News/>;
}
