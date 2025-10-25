import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@visume/ui/components/button";
import { currentUser } from "@clerk/nextjs/server";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@visume/ui/components/avatar";

export default async function Page() {
  const user = await currentUser();

  if (!user) {
    redirect("/login");
  }
  return (
    <div className="m-8">
      <div>
        <div className="mt-5 flex gap-5 items-center">
          <Avatar className="size-18 ">
            <AvatarImage
              src={user.imageUrl}
              alt={user.firstName + "Profile pic"}
            />
            <AvatarFallback>{user.firstName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <h2 className=" font-semibold text-2xl">
            Welcome, <span className="text-primary">{user.firstName}!</span>
          </h2>
        </div>
      </div>

      <div className="grid h-[calc(100vh_-_200px)] place-content-center gap-5 text-center">
        <p className="text-gray-500">
          This Page is under maintenance, Try visiting resumes.
        </p>
        <Link href="/dashboard/resumes">
          <Button>View resumes</Button>
        </Link>
      </div>
    </div>
  );
}
