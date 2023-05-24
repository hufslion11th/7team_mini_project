import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import useSWR from "swr";
import { Post, Sub } from "../types";
import axios from "axios";
import { useAuthState } from "../context/auth";
import useSWRInfinite from "swr/infinite";
import PostCard from "../components/PostCard";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const { authenticated } = useAuthState();

  const fetcher = async (url: string) => {
    return await axios.get(url).then((res) => res.data);
  };
  const address = `/subs/sub/topSubs`;

  const getKey = (pageIndex: number, previousPageData: Post[]) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/posts?page=${pageIndex}`;
  };

  const {
    data,
    error,
    size: page,
    setSize: setPage,
    isValidating,
    mutate,
  } = useSWRInfinite<Post[]>(getKey);
  const isInitialLoading = !data && !error;
  const posts: Post[] = data ? ([] as Post[]).concat(...data) : [];
  const { data: topSubs } = useSWR<Sub[]>(address, fetcher);

  const [observedPost, setObservedPost] = useState("");

  useEffect(() => {
    // 포스트가 없다면 return
    if (!posts || posts.length === 0) return;
    // posts 배열안에 마지막 post에 id를 가져옵니다.
    const id = posts[posts.length - 1].identifier;
    // posts 배열에 post가 추가돼서 마지막 post가 바뀌었다면
    // 바뀐 post 중 마지막post를 obsevedPost로
    if (id !== observedPost) {
      setObservedPost(id);
      observeElement(document.getElementById(id));
    }
  }, [posts]);

  const observeElement = (element: HTMLElement | null) => {
    if (!element) return;
    // 브라우저 뷰포트(ViewPort)와 설정한 요소(Element)의 교차점을 관찰
    const observer = new IntersectionObserver(
      // entries는 IntersectionObserverEntry 인스턴스의 배열
      (entries) => {
        // isIntersecting: 관찰 대상의 교차 상태(Boolean)
        if (entries[0].isIntersecting === true) {
          console.log("마지막 포스트에 왔습니다.");
          setPage(page + 1);
          observer.unobserve(element);
        }
      },
      { threshold: 1 }
    );
    // 대상 요소의 관찰을 시작
    observer.observe(element);
  };

  return (
    <div className="flex-col justify-center align-center max-w-5xl px-4 pt-5 mx-auto">
      {/* 포스트 리스트 */}
      {/* <div className="w-full md:mr-3 md:w-8/12">
        {isInitialLoading && (
          <p className="text-lg text-center">로딩중입니다...</p>
        )}
        {posts?.map((post) => (
          <PostCard key={post.identifier} post={post} mutate={mutate} />
        ))}
      </div> */}

      {/* 사이드바 */}
      <div className="hidden w-12/12 ml-1 mt-14 md:block">
        <div className="bg-white border rounded-lg">
          <div className="p-4 border-b">
            <p className="text-lg font-semibold text-center">
              모현의 방 둘러보기
            </p>
          </div>

          {/* 커뮤니티 리스트 */}
          <div>
            {topSubs?.map((sub) => (
              <div
                key={sub.name}
                className="flex items-center px-4 py-2 text-xl border-b"
              >
                <Link href={`/r/${sub.name}`}>
                  <a>
                    <Image
                      src={sub.imageUrl}
                      className="rounded-full cursor-pointer"
                      alt="Sub"
                      width={72}
                      height={72}
                    />
                  </a>
                </Link>
                <Link href={`/r/${sub.name}`}>
                  <a className="ml-2 font-bold hover:cursor-pointer">
                    {sub.name}
                  </a>
                </Link>
                {/* <p className="ml-auto font-md">{sub.postCount}</p> */}
              </div>
            ))}
          </div>
          {authenticated && (
            <div className="w-full py-6 text-center">
              <Link href="/subs/create">
                <a className="w-full p-2 text-center text-white bg-rose-200 rounded">
                  방 등록하기
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="flex-col mt-24">
        <div className="flex mt-20 justify-center items-center">
          <span className="text-lg font-semibold text-center">
            모현의 집 추천
          </span>
        </div>
        <div className="flex justify-center items-center t-20">
          <div className="flex-col mt-7 p-10">
            <div className="rounded-3xl cursor-pointer bg-neutral-300 w-96 h-96" />
            <div className="flex space-x-0">
              <div className="flex justify-center items-center text-white bg-rose-200 rounded-lg w-14 h-7 mt-2">
                <span className="text-sm text-center text-neutral-700">
                  원룸
                </span>
              </div>
              <div className="flex justify-center items-center h-7 mt-2 pl-3">
                <span className="text-sm text-center text-neutral-700 font-bold">
                  월세 500/40
                </span>
              </div>
            </div>
          </div>
          <div className="flex-col mt-7 p-10">
            <div className="rounded-3xl cursor-pointer bg-neutral-300 w-96 h-96" />
            <div className="flex space-x-0">
              <div className="flex justify-center items-center text-white bg-rose-200 rounded-lg w-14 h-7 mt-2">
                <span className="text-sm text-center text-neutral-700">
                  원룸
                </span>
              </div>
              <div className="flex justify-center items-center h-7 mt-2 pl-3">
                <span className="text-sm text-center text-neutral-700 font-bold">
                  월세 300/30
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
