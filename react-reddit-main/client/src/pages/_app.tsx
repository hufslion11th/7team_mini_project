import "../styles/globals.css";
import type { AppProps } from "next/app";
import Axios from "axios";
import { AuthProvider } from "../context/auth";
import { useRouter } from "next/router";
import NavBar from "../components/NavBar";
import { SWRConfig } from "swr";
import axios from "axios";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api";
  Axios.defaults.withCredentials = true;

  const { pathname } = useRouter();
  const authRoutes = ["/register", "/login"];
  const authRoute = authRoutes.includes(pathname);

  const fetcher = async (url: string) => {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  };

  <div className="">
    <nav class="flex justify-center space-x-4">
      <a
        href="/dashboard"
        class="font-medium px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900"
      >
        Home
      </a>
      <a
        href="/team"
        class="font-medium px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900"
      >
        Team
      </a>
      <a
        href="/projects"
        class="font-medium px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900"
      >
        Projects
      </a>
      <a
        href="/reports"
        class="font-medium px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900"
      >
        Reports
      </a>
    </nav>
  </div>;

  return (
    <>
      <Head>
        <script
          defer
          src="https://use.fontawesome.com/releases/v6.1.1/js/all.js"
          integrity="sha384-xBXmu0dk1bEoiwd71wOonQLyH+VpgR1XcDH3rtxrLww5ajNTuMvBdL5SOiFZnNdp"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <SWRConfig
        value={{
          fetcher,
        }}
      >
        <AuthProvider>
          {!authRoute && <NavBar />}
          <div className={authRoute ? "" : "pt-13 bg-gray-200 min-h-screen"}>
            <Component {...pageProps} />
          </div>
        </AuthProvider>
      </SWRConfig>
    </>
  );
}

export default MyApp;
