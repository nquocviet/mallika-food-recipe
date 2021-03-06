import { Suspense, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Phone } from '@layout/Phone';
import { Main } from '@layout/Main';
import { Content } from '@layout/Content';
import { Loading } from '@components/Loading';
import { lazyImportWithDelay } from '@helpers/helpers';
import { clearError } from '@features/auth-slice';
import { getUser, selectorUser } from '@features/user-slice';
import { PrivateRoute } from '@routes/PrivateRoute';
import { PublicRoute } from '@routes/PubliceRoute';
import AuthVerify from '@common/AuthVerify';

const LandingPage = lazyImportWithDelay(import('@pages/Landing/Landing'));
const LoginPage = lazyImportWithDelay(import('@pages/Auth/Login'));
const RegisterPage = lazyImportWithDelay(import('@pages/Auth/Register'));
const SplashPage = lazyImportWithDelay(import('@pages/Splash/Splash'));
const HomePage = lazyImportWithDelay(import('@pages/Home/Home'));
const SearchPage = lazyImportWithDelay(import('@pages/Search/Search'));
const GroceryPage = lazyImportWithDelay(import('@pages/Grocery/Grocery'));
const ProfilePage = lazyImportWithDelay(import('@pages/Profile/Profile'));
const DetailCookbookPage = lazyImportWithDelay(
  import('@pages/DetailCookbook/DetailCookbook')
);
const RecipeDetailPage = lazyImportWithDelay(
  import('@pages/RecipeDetail/RecipeDetail')
);
const OtherProfilePage = lazyImportWithDelay(
  import('@pages/Profile/OtherProfile')
);

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user: any = useSelector(selectorUser);
  const token = localStorage.getItem('token');

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch, location]);

  useEffect(() => {
    if (user && user.firstLogin) {
      navigate('/splash');
    }

    if (token && !user) {
      dispatch(getUser());
    }
  }, [dispatch, user]);

  return (
    <Phone>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route element={<Content />}>
              <Route path='/' element={<LandingPage />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/register' element={<RegisterPage />} />
            </Route>
          </Route>
          <Route path='/splash' element={<SplashPage />} />
          <Route element={<PrivateRoute />}>
            <Route element={<Main />}>
              <Route path='/home' element={<HomePage />} />
              <Route path='/search' element={<SearchPage />} />
              <Route path='/grocery' element={<GroceryPage />} />
              <Route path='/profile' element={<ProfilePage />} />
            </Route>
            <Route element={<Content />}>
              <Route path='/detail-cookbook' element={<DetailCookbookPage />} />
              <Route path='/recipe/:id' element={<RecipeDetailPage />} />
              <Route path='/user/:id' element={<OtherProfilePage />} />
            </Route>
          </Route>
        </Routes>
        <AuthVerify />
      </Suspense>
    </Phone>
  );
};

export default App;
