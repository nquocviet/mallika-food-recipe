import LandingImage from '@img/landing-page.jfif';
import GoogleLogo from '@img/google-logo.svg';
import FacebookLogo from '@img/facebook-logo.svg';
import { Link } from 'react-router-dom';
import PasswordInput from '@components/Input/PasswordInput';
import Button from '@components/Button/Button';
import TextInput, { InputTypes } from '../../components/Input/TextInput';
import CustomButton, {
  ButtonTypes,
  ButtonVariants,
} from '@components/Button/Button';

const Login = () => {
  return (
    <>
      <img src={LandingImage} className='rounded-t-3xl' alt='recipe landing' />
      <div className='rounded-3xl absolute top-1/4 inset-x-0 bg-white'>
        <div className='pt-5'>
          <div className='px-4 sm:px-0 text-center'>
            <h3 className='text-2xl font-medium leading-6 text-gray-900'>
              Mallika
            </h3>
            <p className='mt-1 text-sm text-gray-900'>Everyone can be a chef</p>
          </div>
        </div>
        <div className='mt-5 px-5'>
          <form>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-12'>
                <TextInput
                  type={InputTypes.Email}
                  name='email'
                  placeholder='Email Address'
                />
              </div>
              <div className='col-span-12'>
                <PasswordInput placeholder='Password' name='password' />
              </div>
              <div className='col-span-12'>
                <CustomButton type={ButtonTypes.Submit} fluid={true}>
                  Sign in
                </CustomButton>
              </div>
            </div>
          </form>
          <div className='flex justify-center py-5'>
            <div className='w-4/5 grid grid-cols-12 gap-4 justify-center items-center'>
              <span className='col-span-5 h-px bg-neutral-400'></span>
              <span className='col-span-2 text-center text-neutral-400'>
                OR
              </span>
              <span className='col-span-5 h-px bg-neutral-400'></span>
            </div>
          </div>
          <div className='grid grid-cols-12 gap-4'>
            <div className='col-span-6'>
              <Button
                variant={ButtonVariants.Secondary}
                children='Facebook'
                fluid={true}
                prefix={
                  <img
                    src={FacebookLogo}
                    width={16}
                    className='mr-2'
                    alt='facebook logo'
                  />
                }
              />
            </div>
            <div className='col-span-6'>
              <Button
                variant={ButtonVariants.Secondary}
                children='Google'
                fluid={true}
                prefix={
                  <img
                    src={GoogleLogo}
                    width={16}
                    className='mr-2'
                    alt='google logo'
                  />
                }
              />
            </div>
            <div className='col-span-12 color-orange text-center text-sm'>
              Don't have an account?
              <Link to='/sign-up' className='underline mx-1'>
                Sign up
              </Link>
              now
            </div>
          </div>
          <div className='py-5 text-xs text-center'>
            <span>By continuing, you agree to our</span>
            <div className='flex justify-center items-center pt-2'>
              <a href='#' className='underline'>
                Terms of Service
              </a>
              <span className='mx-2'>.</span>
              <a href='#' className='underline'>
                Privacy Policy
              </a>
              <span className='mx-2'>.</span>
              <a href='#' className='underline'>
                Content Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;