import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, {
    ChangeEvent,
    FormEvent,
    useEffect,
    useRef,
    useState,
} from "react";
import useSWR from "swr";
import PostCard from "../../components/PostCard";
import SideBar from "../../components/SideBar";
import { useAuthState } from "../../context/auth";
import { Post } from "../../types";

const SubPage = () => {
    const [ownSub, setOwnSub] = useState(false);
    const { authenticated, user } = useAuthState();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const subName = router.query.sub;
    const {
        data: sub,
        error,
        mutate,
    } = useSWR(subName ? `/subs/${subName}` : null);
    useEffect(() => {
        if (!sub || !user) return;
        setOwnSub(authenticated && user.username === sub.username);
    }, [sub]);
    console.log("sub", sub);
    const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files === null) return;

        const file = event.target.files[0];
        console.log("file", file);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", fileInputRef.current!.name);

        try {
            await axios.post(`/subs/${sub.name}/upload`, formData, {
                headers: { "Context-Type": "multipart/form-data" },
            });
        } catch (error) {
            console.log(error);
        }
    };

    const openFileInput = (type: string) => {
        const fileInput = fileInputRef.current;
        if (fileInput) {
            fileInput.name = type;
            fileInput.click();
        }
    };

    let renderPosts;
    if (!sub) {
        renderPosts = <p className="text-lg text-center">로딩중...</p>;
    } else if (sub.posts.length === 0) {
        renderPosts = (
            <p className="text-lg text-center">
                아직 작성된 포스트가 없습니다.
            </p>
        );
    } else {
        renderPosts = sub.posts.map((post: Post) => (
            <PostCard key={post.identifier} post={post} subMutate={mutate} />
        ));
    }
    console.log("sub.imageUrl", sub?.imageUrl);
    return (
        <>
            {sub && (
                <>
                    <div>
                        <input
                            type="file"
                            hidden={true}
                            ref={fileInputRef}
                            onChange={uploadImage}
                        />
                        {/* 배너 이미지 */}
                        <div className="bg-gray-400">
                            {sub.bannerUrl ? (
                                <div
                                    className="h-56"
                                    style={{
                                        backgroundImage: `url(${sub.bannerUrl})`,
                                        backgroundRepeat: "no-repeat",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                    onClick={() => openFileInput("banner")}
                                ></div>
                            ) : (
                                <div
                                    className="h-60 bg-fuchsia-50"
                                    onClick={() => openFileInput("banner")}
                                ></div>
                            )}
                        </div>
                        {/* 커뮤니티 메타 데이터 */}
                        <div className="h-20 bg-white">
                            <div className="relative flex max-w-5xl px-5 mx-auto">
                                <div className="absolute" style={{ top: -15 }}>
                                    {sub.imageUrl && (
                                        <Image
                                            src={sub.imageUrl}
                                            // src="/images/모방구_로고_HY헤드라인M.png"
                                            alt="커뮤니티 이미지"
                                            width={70}
                                            height={70}
                                            className="rounded-full"
                                            onClick={() =>
                                                openFileInput("image")
                                            }
                                        />
                                    )}
                                </div>
                                <div className="pt-1 pl-24">
                                    <div className="text-3xl font-bold">
                                        {sub.name}
                                    </div>
                                    <div className="flex items-center">
                                        <h1 className="font-bold text-rose-200 text-small">
                                            {sub.title}
                                        </h1>
                                    </div>
                                </div>
                                <div className="px-8">
                                    <h3 className="mx-1 hover:underline text-gray-400 font-bold">
                                        {sub.username}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 포스트와 사이드바 */}
                    {/* <div className='flex max-w-5xl px-4 pt-5 mx-auto'>
                        <div className="w-full md:mr-3 md:w-8/12">{renderPosts} </div>
                        <SideBar sub={sub} />
                    </div> */}

                    {/* Description */}
                    <div className="flex max-w-5xl px-4 pt-5 mx-auto font-bold">
                        <div className="w-full md:mr-3 md:w-8/12">
                            {sub?.description}
                        </div>
                    </div>

                    {/* 사진 등록하기 */}
                    <div className="flex items-stretch">
                        {/* 포스트 생성 */}
                        {/* <div className="mx-0 my-2">
                            <Link href={`/r/${sub.name}/create`}>
                                <a className="w-full p-2 text-sm text-white bg-rose-200 rounded">
                                    방 사진 등록
                                </a>
                            </Link>
                        </div> */}
                        <div className="flex-col max-w-5xl px-4 pt-5 mx-auto font-bold justify-items-center">
                            <div className="p-4 px-8 text-black-200 font-bold text-center border-b-2">
                                방 사진
                            </div>
                            <div className="py-8">
                                <div className="border-4 rounded-lg border-rose-200">
                                    {sub.imageUrl && (
                                        <Image
                                            src={sub.imageUrl}
                                            alt="방 사진"
                                            width={450}
                                            height={450}
                                            className=""
                                            onClick={() =>
                                                openFileInput("image")
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default SubPage;
