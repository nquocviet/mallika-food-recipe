import React, { ChangeEvent, useEffect, useState } from 'react';
import Thumbnail from '@img/thumbnail.png';
import RoundedButton, {
  RoundedButtonSizes,
  RoundedButtonVariants,
} from '@components/Button/RoundedButton';
import { useDispatch, useSelector } from 'react-redux';
import { selectorUser } from '@features/auth-slice';
import { generateBase64Image } from '@helpers/helpers';
import { List20Regular } from '@fluentui/react-icons';
import { Tab, Tabs } from '@components/Tabs/Tabs';
import { ReviewList, MyReview } from '@components/Review/Review';
import { CardSkeleton } from '@components/Skeleton/Skeleton';
import { Card, CardList } from '@components/Card/Card';
import { uiActions } from '@features/ui-slice';
import AccountDrawer from './components/AccountDrawer';
import LikedRecipeDrawer from './components/LikedRecipeDrawer';
import NotificationDrawer from './components/NotificationDrawer';
import EditProfileDrawer from './components/EditProfileDrawer';
import { getMyRecipes, selectorMyRecipes } from '@features/recipe-slice';
import { RootState } from '@redux/reducers';
import { Loading } from '@components/Loading/Loading';
import BoxEmpty from '@img/box-empty.png';
import cx from 'clsx';

import RecipeImage1 from '@img/recipe-1.png';
import RecipeImage2 from '@img/recipe-2.png';
import RecipeImage3 from '@img/recipe-3.png';
import RecipeImage4 from '@img/recipe-4.png';
import RecipeImage5 from '@img/recipe-5.png';

const dumbReviews = [
  {
    id: '1',
    recipe: {
      title: 'Resep Masakan Lemang Ikan Mas',
      image: RecipeImage1,
    },
    comment: 'Resepnya menarik mesti dicoba nih, terima kasih bunda',
  },
  {
    id: '2',
    recipe: {
      title: 'Resep Mie Goreng Aceh Enak Sederhana',
      image: RecipeImage2,
    },
    comment: 'Wah ternyata sederhana ya cara masaknya 😃',
  },
  {
    id: '3',
    recipe: {
      title: 'Bebek Goreng Lezat',
      image: RecipeImage3,
    },
    comment: 'Step-stepnya mudah diikuti dan jelas, terima kasih',
  },
  {
    id: '4',
    recipe: {
      title: 'Resep Masakan Lemang Ikan Mas',
      image: RecipeImage4,
    },
    comment: 'Resepnya menarik mesti dicoba nih, terima kasih bunda',
  },
  {
    id: '5',
    recipe: {
      title: 'Resep Mie Goreng Aceh Enak Sederhana',
      image: RecipeImage5,
    },
    comment: 'Step-stepnya mudah diikuti dan jelas, terima kasih',
  },
];

const Profile = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const dispatch = useDispatch();
  const user: any = useSelector(selectorUser);
  const myRecipes: any = useSelector(selectorMyRecipes);
  const loading = useSelector(
    ({ loading }: RootState) => loading.myRecipesLoading
  );
  const profileClassNames = cx(
    'px-4 -mb-6 transition-transform',
    isScrolled ? '-translate-y-10' : 'translate-y-0'
  );
  const tabsClassNames = cx(
    'transition-transform pt-2 bg-white',
    isScrolled ? '-translate-y-24' : 'translate-y-0'
  );

  useEffect(() => {
    if (!myRecipes) {
      dispatch(getMyRecipes());
    }
  }, [dispatch]);

  if (!user) return <Loading />;

  const onScroll = (e: ChangeEvent<HTMLInputElement>) => {
    const element = e.target;

    if (element && element.scrollTop > 0) {
      return setIsScrolled(true);
    }
    return setIsScrolled(false);
  };

  return (
    <>
      <div className='relative h-1/4'>
        <img
          src={Thumbnail}
          className='absolute inset-0 w-full h-full object-cover'
          alt='thumbnail recipe of user'
        />
        <RoundedButton
          className='absolute z-10 top-4 right-3'
          variant={RoundedButtonVariants.SECONDARY}
          size={RoundedButtonSizes.SMALL}
          onClick={() => dispatch(uiActions.setAccountDrawerShowing(true))}
        >
          <List20Regular />
        </RoundedButton>
      </div>
      <div className={profileClassNames}>
        <div className='relative bg-white text-center -translate-y-10 rounded-t-2xl'>
          <img
            src={generateBase64Image(user.avatar)}
            className='absolute left-1/2 w-24 h-24 object-cover border-4 border-white rounded-full -translate-x-1/2 -translate-y-1/2'
            alt='user avatar'
          />
          <h3 className='text-xl font-medium pt-12'>{user.name}</h3>
          <p className='text-gray-800 text-sm'>{user.bio}</p>
          <p className='text-gray-800 text-sm'>0 Followers · 0 Following</p>
        </div>
      </div>
      <Tabs className={tabsClassNames} onTrigger={() => setIsScrolled(false)}>
        <Tab
          label='Posts'
          className={cx(
            'pt-3 px-3 overflow-auto scrollbar-none',
            isScrolled ? 'h-96 pb-10' : 'h-72 pb-8'
          )}
          onScroll={onScroll}
        >
          <>
            <CardList>
              {loading
                ? [...Array(3).keys()].map((_, index) => (
                    <CardSkeleton key={index} />
                  ))
                : myRecipes &&
                  myRecipes.map((recipe: any) => (
                    <Card key={recipe._id} {...recipe} />
                  ))}
            </CardList>
            {myRecipes && !myRecipes.length && (
              <div className='flex flex-col items-center text-center px-4 pt-4'>
                <img src={BoxEmpty} alt='no ingredients yet' width='150' />
                <h4 className='font-semibold'>No recipes yet!</h4>
                <p>Click the plus button to create some recipes of your own.</p>
              </div>
            )}
          </>
        </Tab>
        <Tab
          label='Reviews'
          className={cx(
            'overflow-auto scrollbar-none',
            isScrolled ? 'h-96 pb-10' : 'h-72 pb-8'
          )}
          onScroll={onScroll}
        >
          <ReviewList>
            {dumbReviews.map((review) => (
              <MyReview key={review.id} {...review} />
            ))}
          </ReviewList>
        </Tab>
      </Tabs>
      <AccountDrawer />
      <LikedRecipeDrawer />
      <NotificationDrawer />
      <EditProfileDrawer />
    </>
  );
};

export default Profile;
