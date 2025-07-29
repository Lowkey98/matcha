import { Helmet } from 'react-helmet';
import ImagesCarousel from '../components/ImagesCarousel';
import {
  AgendaIcon,
  GenderIcon,
  HearthIcon,
  LocationOutlineIcon,
  ProfileIcon,
  ThreeDotsIcon,
} from '../components/Icons';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { useParams } from 'react-router-dom';
import { getUserInfoWithRelation, like, unlike } from '../../Api';
import { UserInfoWithRelation } from '../../../shared/types';
import { GenderCard } from './Profile';
import ButtonLike from '../components/Buttons/ButtonLike';
import ButtonUnlike from '../components/Buttons/ButtonUnlike';
export default function ProfileUser() {
  const { user } = useContext(UserContext);
  const { targetUserId } = useParams<{ targetUserId: string }>();
  const [targetUserInfo, setTargetUserInfo] =
    useState<UserInfoWithRelation | null>(null);

  function handleClickLike() {
    const token = localStorage.getItem('token');
    if (targetUserInfo && user && targetUserId && token) {
      like({ actorUserId: user.id, targetUserId: Number(targetUserId), token })
        .then(() => {
          setTargetUserInfo({
            ...targetUserInfo,
            isBlock: false,
            isLike: true,
          });
        })
        .catch((error) => {
          console.log('error:', error);
        });
    }
  }

  function handleClickUnlike() {
    const token = localStorage.getItem('token');
    if (targetUserInfo && user && targetUserId && token) {
      unlike({
        actorUserId: user.id,
        targetUserId: Number(targetUserId),
        token,
      })
        .then(() => {
          setTargetUserInfo({
            ...targetUserInfo,
            isBlock: false,
            isLike: false,
          });
        })
        .catch((error) => {
          console.log('error:', error);
        });
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && user && targetUserId) {
      getUserInfoWithRelation({
        token,
        actorUserId: user.id,
        targetUserId: Number(targetUserId),
      })
        .then((targetUser: UserInfoWithRelation) => {
          setTargetUserInfo(targetUser);
        })
        .catch((error) => {
          console.log('error', error);
        });
    }
  }, [user]);

  if (targetUserInfo)
    return (
      <>
        <Helmet>
          <title>Matcha - Profile</title>
        </Helmet>
        <main className="mt-12 mb-22 flex flex-col gap-4 lg:mb-5 lg:ml-57 lg:flex-row lg:items-start lg:justify-center lg:gap-9">
          <ImagesCarousel
            imgsUrls={targetUserInfo.imagesUrls ?? []}
            className="h-[35rem] lg:w-full xl:w-[30rem] xl:shrink-0"
          />
          <div className="flex flex-col gap-8 lg:w-full xl:w-127">
            <div>
              <span className="text-secondary text-xl font-bold">
                {targetUserInfo.username}
              </span>
              <div className="mt-.5 flex items-center gap-1">
                <div className="h-2.5 w-2.5 rounded-full bg-[#71D191]"></div>
                <span className="text-grayDark font-light">Online</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!targetUserInfo.isLike ? (
                <ButtonLike
                  className="w-full lg:w-52"
                  onClick={handleClickLike}
                />
              ) : (
                <ButtonUnlike
                  className="w-full lg:w-52"
                  onClick={handleClickUnlike}
                />
              )}
              <button
                type="button"
                className="border-grayDark-100 flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-2"
              >
                <ThreeDotsIcon className="fill-secondary size-5" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <ProfileIcon className="fill-primary h-6 w-6" />
                <span className="text-secondary">
                  {targetUserInfo.firstName} {targetUserInfo.lastName}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <LocationOutlineIcon className="fill-primary h-6 w-6" />
                <span className="text-secondary">Rue 02 zarktouni</span>
              </div>
              <div className="flex items-center gap-3">
                <AgendaIcon className="fill-primary h-6 w-6" />
                <span className="text-secondary">
                  {targetUserInfo.age} years
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 lg:flex-col lg:items-start xl:flex-row xl:justify-start">
              <GenderCard
                icon={<GenderIcon className="fill-primary h-6 w-6" />}
                title="Gender"
                gender={targetUserInfo.gender || ''}
                className="w-full lg:w-62"
              />
              <GenderCard
                icon={<HearthIcon className="fill-primary h-6 w-6" />}
                title="Sexual preferences"
                gender={targetUserInfo.sexualPreference || ''}
                className="w-full lg:w-62"
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-4">
                {targetUserInfo.interests &&
                  targetUserInfo.interests.length > 0 &&
                  targetUserInfo.interests.map((interest) => (
                    <div
                      className="border-grayDark-100 text-grayDark rounded-full border-2 bg-white px-5 py-2"
                      key={interest}
                    >
                      {interest}
                    </div>
                  ))}
              </div>
              <hr className="text-grayDark-100" />
              <p className="text-secondary">{targetUserInfo.biography}</p>
            </div>
          </div>
        </main>
      </>
    );
}
