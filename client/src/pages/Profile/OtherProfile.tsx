import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { convertNumber, generateBase64Image } from '@helpers/helpers';
import {
  ChevronLeft24Regular,
  HeartBroken16Regular,
} from '@fluentui/react-icons';
import { Tab, Tabs } from '@components/Tabs';
import { CardSkeleton, ProfileSkeleton } from '@components/Skeleton';
import { Card, CardList } from '@components/Card';
import { Button } from '@components/Button';
import { Spinner } from '@components/Loading';
import { RootState } from '@redux/reducers';
import { getRecipesByUserId, selectorOwnRecipes } from '@features/recipe-slice';
import { getUserById, followUser, unfollowUser } from '@features/user-slice';
import { uiActions } from '@features/ui-slice';
import BoxEmpty from '@img/box-empty.png';
import FollowingDrawer from './components/FollowingDrawer';
import FollowersDrawer from './components/FollowersDrawer';

const OtherProfile = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { users } = useSelector(({ user }: RootState) => user);
  const ownRecipes: any = useSelector(selectorOwnRecipes);
  const loading = useSelector(
    ({ loading }: RootState) => loading.ownRecipesLoading
  );

  useEffect(() => {
    if (userId && !users[userId]) {
      dispatch(getUserById(userId));
    }
    if (userId && !ownRecipes[userId]) {
      dispatch(getRecipesByUserId(userId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, dispatch]);

  const handleScroll = (e) => {
    if (userId) {
      const { outOfRecipes } = ownRecipes[userId];
      const isBottom =
        e.target.scrollHeight - e.target.scrollTop - 1 <= e.target.clientHeight;

      if (loading) return;

      if (isBottom && !loading && !outOfRecipes) {
        dispatch(getRecipesByUserId(userId));
      }
    }
  };

  const renderProfileHeader = () => {
    const {
      email,
      avatar,
      name,
      bio,
      numRecipes,
      numFollowers,
      numFollowing,
      isFollowing,
    } = userId && users[userId];

    return (
      <>
        <div className='sticky z-10 top-0 bg-white flex items-center gap-4 px-layout'>
          <button onClick={() => navigate(-1)}>
            <ChevronLeft24Regular />
          </button>
          <div className='text-lg -mt-0.5 font-semibold line-clamp-1'>
            {email}
          </div>
        </div>
        <div className='px-layout pt-4'>
          <div className='flex justify-between items-center gap-4'>
            <img
              src={generateBase64Image(avatar)}
              className='w-[72px] h-[72px] flex-shrink-0 object-cover rounded-full'
              alt='user avatar'
            />
            <div className='flex flex-col items-stretch'>
              <div className='flex justify-center items-center gap-4 text-gray-800 text-xs text-center whitespace-nowrap pt-2'>
                <div className='flex-1'>
                  <span className='block text-black text-lg leading-4 font-semibold'>
                    {convertNumber(numRecipes)}
                  </span>
                  Recipes
                </div>
                <div
                  className='flex-1 cursor-pointer'
                  onClick={() =>
                    dispatch(uiActions.setFollowersDrawerShowing(true))
                  }
                >
                  <span className='block text-black text-lg leading-4 font-semibold'>
                    {convertNumber(numFollowers)}
                  </span>
                  Followers
                </div>
                <div
                  className='flex-1 cursor-pointer'
                  onClick={() =>
                    dispatch(uiActions.setFollowingDrawerShowing(true))
                  }
                >
                  <span className='block text-black text-lg leading-4 font-semibold'>
                    {convertNumber(numFollowing)}
                  </span>
                  Following
                </div>
              </div>
              {isFollowing ? (
                <Button
                  variant='secondary'
                  size='xs'
                  className='mt-2 gap-1'
                  onClick={() => dispatch(unfollowUser(userId))}
                >
                  <>
                    Unfollow
                    <HeartBroken16Regular />
                  </>
                </Button>
              ) : (
                <Button
                  variant='primary'
                  size='xs'
                  className='mt-2'
                  onClick={() => dispatch(followUser(userId))}
                >
                  Follow
                </Button>
              )}
            </div>
          </div>
          <div className='flex flex-col items-start pt-1'>
            <h3 className='text-lg font-semibold line-clamp-2'>{name}</h3>
            <p className='text-gray-800 text-sm line-clamp-2'>{bio}</p>
          </div>
        </div>
      </>
    );
  };

  return (
    <div
      className='h-full overflow-auto scrollbar-none animate-slide-in'
      onScroll={handleScroll}
    >
      {userId && !users[userId] ? <ProfileSkeleton /> : renderProfileHeader()}
      <Tabs
        className='pt-2 bg-white'
        labelClassName='flex-1'
        labelContainerClassName='sticky z-10 top-6 bg-white pt-4'
      >
        <Tab label='Posts' className='pt-3 px-3 pb-2'>
          <>
            <CardList>
              {loading && userId && !ownRecipes[userId]
                ? [...Array(3).keys()].map((_, index) => (
                    <CardSkeleton key={index} />
                  ))
                : userId &&
                  ownRecipes[userId] &&
                  ownRecipes[userId].recipes.map((recipe: any) => (
                    <Card key={recipe._id} {...recipe} />
                  ))}
            </CardList>
            {loading && userId && ownRecipes[userId] && (
              <div className='flex justify-center h-7 pt-2'>
                <Spinner color='var(--color-orange)' />
              </div>
            )}
            {userId &&
              ownRecipes[userId] &&
              !ownRecipes[userId].recipes.length && (
                <div className='flex flex-col items-center text-center px-4 pt-4'>
                  <img src={BoxEmpty} alt='no ingredients yet' width='150' />
                  <h4 className='font-semibold'>No recipes yet!</h4>
                  <p>
                    Click the plus button to create some recipes of your own.
                  </p>
                </div>
              )}
          </>
        </Tab>
        <Tab label='Cookbooks' className='pb-2'>
          <div className='p-layout'>
            This featured is not completed. Please try this later!
          </div>
        </Tab>
      </Tabs>
      <FollowersDrawer userId={userId as string} />
      <FollowingDrawer userId={userId as string} />
    </div>
  );
};

export default OtherProfile;
