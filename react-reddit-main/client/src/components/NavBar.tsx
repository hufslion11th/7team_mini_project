import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { useAuthDispatch, useAuthState } from "../context/auth";

const NavBar: React.FC = () => {
  const { loading, authenticated } = useAuthState();
  const dispatch = useAuthDispatch();

  const handleLogout = () => {
    axios
      .post("/auth/logout")
      .then(() => {
        dispatch("LOGOUT");
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between px-5 bg-white h-12">
      <div className="flex">
        <span className="text-2xl font-semibold text-gray-400 p-2">
          <Link href="/">
            <a>
              <Image
                src="/images/logo.jpg"
                alt="logo"
                width={110}
                height={40}
              ></Image>
            </a>
          </Link>
        </span>
        <div className="flex justify-start items-center">
          <span className="ml-5 mr-5 text-sm font-medium">
            <Link href="/">아파트</Link>
          </span>
          <span className="ml-5 mr-5 text-sm font-medium">
            <Link href="/">빌라, 투룸+</Link>
          </span>
          <span className="ml-5 mr-5 text-sm font-medium">
            <Link href="/">원룸</Link>
          </span>
          <span className="ml-5 mr-5 text-sm font-medium">
            <Link href="/">오피스텔</Link>
          </span>
        </div>
      </div>
      <div className="flex">
        <div className="max-w-full px-3">
          <div className="relative flex items-center bg-gray-100 border rounded-2xl hover:border-gray-700 hover:bg-white">
            <FaSearch className="ml-2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="px-4 py-1 bg-transparent rounded h-7 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex">
          {!loading &&
            (authenticated ? (
              <button
                className="w-20 px-1 mr-2 text-sm text-center text-white bg-gray-400 rounded h-7"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            ) : (
              <>
                <Link href="/login">
                  <a className="w-20 px-2 pt-1 mr-2 text-sm text-center text-black bg-white rounded h-7">
                    Log In
                  </a>
                </Link>
                {/* <Link href="/register">
                <a className="w-20 px-2 pt-1 text-sm text-center text-white bg-gray-400 rounded h-7">
                  회원가입
                </a>
              </Link> */}
              </>
            ))}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
