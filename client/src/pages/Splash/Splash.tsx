import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@components/Button';
import { finishSplash, selectorUser, updateUser } from '@features/user-slice';
import SplashImage1 from '@img/splash-1.jfif';
import SplashImage2 from '@img/splash-2.jfif';
import SplashImage3 from '@img/splash-3.jfif';
import UnionImage from '@img/union.png';

interface SplashItemTypes {
  title: string;
  image: string;
  content: string;
}

const steps: SplashItemTypes[] = [
  {
    title: 'Make recipes your own',
    image: SplashImage1,
    content:
      'With Mallika recipe editor, you can easily edit recipes, save adjustments to ingredients, and add additional steps or tips to your preparation.',
  },
  {
    title: 'All in one place',
    image: SplashImage2,
    content:
      'Storing your recipes in Mallika allows you to quickly search, find, and select what you want to cook.',
  },
  {
    title: 'Cook from your favorite device',
    image: SplashImage3,
    content:
      'Mallika stores your recipes in the Cloud so you can access them on any device through our website or Android/iOS app.',
  },
];

const Splash = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [skipped, setSkipped] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectorUser);
  const { image } = steps[currentStep];

  useEffect(() => {
    if (skipped) {
      goToHomePage();
    }
  }, [skipped]);

  const goToHomePage = () => {
    dispatch(finishSplash);
    dispatch(updateUser({ _id: user._id, firstLogin: false }));
    navigate('/home');
  };

  return (
    <>
      <div className='relative h-2/5'>
        <img
          src={image}
          className='absolute inset-0 w-full h-full object-cover'
          alt='splash cover'
        />
        {currentStep + 1 < steps.length && (
          <button
            type='button'
            className='absolute z-10 top-4 right-4 bg-black text-white px-3 py-0.5 rounded-2xl'
            onClick={() => setSkipped(true)}
          >
            Skip
          </button>
        )}
      </div>
      <div className='relative z-10 h-3/5 bg-white -mt-4 px-6 py-14 rounded-t-3xl'>
        <div className='overflow-hidden pb-4'>
          <div
            className='flex transition-transform'
            style={{ transform: `translateX(${currentStep * -100}%)` }}
          >
            {steps.map((step, index) => {
              const { title, content } = step;

              return (
                <div
                  key={index}
                  className='flex flex-col justify-start items-center min-w-full text-center h-full mb-auto overflow-auto scrollbar-none'
                >
                  <div className='p-3 border border-gray-400 rounded-full mb-8'>
                    <img
                      src={UnionImage}
                      width={25}
                      alt='logo of mallika food recipe app'
                    />
                  </div>
                  <h2 className='font-medium uppercase text-xl mb-3'>
                    {title}
                  </h2>
                  <p className='text-sm'>{content}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div
          className={`flex items-center ${
            currentStep > 0 ? 'justify-between' : 'justify-end'
          }`}
        >
          {currentStep > 0 && (
            <Button
              variant='secondary'
              size='sm'
              onClick={() => setCurrentStep((prevState) => prevState - 1)}
            >
              Previous
            </Button>
          )}
          {currentStep + 1 === steps.length ? (
            <Button size='sm' onClick={() => setSkipped(true)}>
              Explore now
            </Button>
          ) : (
            <Button
              size='sm'
              onClick={() => setCurrentStep((prevState) => prevState + 1)}
            >
              Next
            </Button>
          )}
        </div>
        <div className='absolute left-1/2 bottom-2 flex gap-2 -translate-x-1/2'>
          {steps.map((_, index) => (
            <span
              key={index}
              className={`${
                currentStep === index ? 'bg-orange' : 'bg-transparent'
              } w-2 h-2 border border-orange rounded-full`}
            ></span>
          ))}
        </div>
      </div>
    </>
  );
};

export default Splash;
