import Image from "next/image";
import { redirect } from "next/navigation";

import { Promo } from "@/components/promo";
import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { getUserProgress, getUserSubscription } from "@/db/queries";

import { Items } from "./items";
import { Quests } from "@/components/quests";

const ShopPage = async () => {
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();

  const [userProgress, userSubscription] = await Promise.all([
    userProgressData,
    userSubscriptionData,
  ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  const isPro = !!userSubscription?.isActive;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">

      {/* SIDEBAR */}
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={isPro}
          streak={userProgress.streak ?? 0}
        />

        {!isPro && <Promo />}

        <Quests points={userProgress.points} />
      </StickyWrapper>

      {/* PRINCIPAL */}
      <FeedWrapper>
        <div className="w-full flex flex-col items-center">

          <Image
            src="/shop.ico"
            alt="Boutique"
            height={90}
            width={90}
          />

          {/* TITRE */}
          <h1 className="text-center font-bold text-foreground text-2xl my-6">
            Boutique
          </h1>

          {/* DESCRIPTION */}
          <p className="text-muted-foreground text-center text-lg mb-6">
            Dépense tes points pour des trucs sympas.
          </p>

          {/* ARTICLES */}
          <Items
            hearts={userProgress.hearts}
            points={userProgress.points}
            hasActiveSubscription={isPro}
          />
        </div>
      </FeedWrapper>

    </div>
  );
};

export default ShopPage;