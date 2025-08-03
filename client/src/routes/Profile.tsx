import { Helmet } from 'react-helmet';
import ImagesCarousel from '../components/ImagesCarousel';
import LinkPrimaryWithIcon from '../components/Links/LinkPrimaryWithIcon';
import {
  AgendaIcon,
  EditIcon,
  GenderIcon,
  HearthIcon,
  LocationOutlineIcon,
  ProfileIcon,
} from '../components/Icons';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
export default function Profile() {
  const { user } = useContext(UserContext);

  if (user)
    return (
      <>
        <Helmet>
          <title>Matcha - Profile</title>
        </Helmet>
        <main className="mt-12 mb-22 flex flex-col gap-4 lg:mb-5 lg:ml-57 lg:flex-row lg:items-start lg:justify-center lg:gap-9">
          <ImagesCarousel
            imgsUrls={user.imagesUrls ?? []}
            className="h-[35rem] lg:w-full xl:w-[30rem] xl:shrink-0"
          />
          <div className="flex flex-col gap-8 lg:w-full xl:w-127">
            <div>
              <span className="text-secondary text-xl font-bold">
                {user.username}
              </span>
              <div className="mt-.5 flex items-center gap-1">
                <div className="h-2.5 w-2.5 rounded-full bg-[#71D191]"></div>
                <span className="text-grayDark font-light">Online</span>
              </div>
            </div>
            <LinkPrimaryWithIcon
              to="/editProfile"
              value="Edit profile"
              icon={<EditIcon className="h-5.5 w-5.5 fill-white" />}
              className="w-full lg:w-52"
            />
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <ProfileIcon className="fill-primary h-6 w-6" />
                <span className="text-secondary">
                  {user.firstName} {user.lastName}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <LocationOutlineIcon className="fill-primary h-6 w-6" />
                <span className="text-secondary">Rue 02 zarktouni</span>
              </div>
              <div className="flex items-center gap-3">
                <AgendaIcon className="fill-primary h-6 w-6" />
                <span className="text-secondary">{user.age} years</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 lg:flex-col lg:items-start xl:flex-row xl:justify-start">
              <GenderCard
                icon={<GenderIcon className="fill-primary h-6 w-6" />}
                title="Gender"
                gender={user.gender || ''}
                className="w-full lg:w-62"
              />
              <GenderCard
                icon={<HearthIcon className="fill-primary h-6 w-6" />}
                title="Sexual preferences"
                gender={user.sexualPreference || ''}
                className="w-full lg:w-62"
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-4">
                {user.interests &&
                  user.interests.length > 0 &&
                  user.interests.map((interest) => (
                    <div
                      className="border-grayDark-100 text-grayDark rounded-full border-2 bg-white px-5 py-2"
                      key={interest}
                    >
                      {interest}
                    </div>
                  ))}
              </div>
              <hr className="text-grayDark-100" />
              <p className="text-secondary">{user.biography}</p>
            </div>
          </div>
        </main>
      </>
    );
}

export function GenderCard({
  icon,
  title,
  gender,
  className,
}: {
  icon: React.JSX.Element;
  title: string;
  gender: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-start gap-3 rounded-lg border-2 border-gray-100 bg-white py-4 pl-5 sm:justify-center sm:pl-0 lg:justify-start lg:pl-5 xl:justify-center ${className}`}
    >
      <div className="bg-primaryLight flex h-12 w-12 items-center justify-center rounded-full">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-grayDark text-sm font-light">{title}</span>
        <span className="text-secondary font-medium">{gender}</span>
      </div>
    </div>
  );
}
