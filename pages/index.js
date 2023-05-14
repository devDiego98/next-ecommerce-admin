import { Inter } from "next/font/google";
import { useSession } from "next-auth/react";
import Layout from "@/components/Layout";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data: session } = useSession();

  return (
    <Layout pageName={"Ecommerce Dashboard"}>
      <div className="flex justify-between w-full">
        <div className="text-blue-900">
          Hello, <b>{session?.user.email}</b>
        </div>
        <div className="flex gap-3">
          <img src={session?.user?.image} className="w-8 rounded-md" />
          {session?.user.name}
        </div>
      </div>
    </Layout>
  );
}
