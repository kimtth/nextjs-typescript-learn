import { useRouter } from "next/router";

function PostView() {

    const router = useRouter();
    const { id } = router.query;

    return (
        <h1>Here is {id}</h1>
    )
}

export default PostView;