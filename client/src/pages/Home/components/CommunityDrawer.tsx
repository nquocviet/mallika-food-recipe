import React, { useEffect, useState } from 'react';
import { Drawer } from '@components/Drawer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/reducers';
import { uiActions } from '@features/ui-slice';
import {
  clearAllRecipes,
  getAllRecipes,
  setFilter,
} from '@features/recipe-slice';
import { CardSmallSkeleton } from '@components/Skeleton';
import { Options20Regular } from '@fluentui/react-icons';
import useToggle from '@hooks/useToggle';
import { Dropdown } from '@components/Dropdown';
import { TagList, Tag } from '@components/Tag';
import { CardList, CardSmall } from '@components/Card';
import { Button } from '@components/Button';
import {
  CATEGORY_NAME,
  RECIPES_BY_CATEGORY,
  RECIPES_BY_SORT,
  SORT_NAME,
} from '@config/recipe';
import { Spinner } from '@components/Loading';
import NoFound from '@img/no-found.png';
import cx from 'clsx';
import { useLocation } from 'react-router-dom';

const CommunityDrawer = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isShowing, toggle } = useToggle();
  const active = useSelector(({ ui }: RootState) => ui.communityDrawerShowing);
  const loading = useSelector(
    ({ loading }: RootState) => loading.allRecipesLoading
  );
  const { recipes, outOfRecipe, filterApplied } = useSelector(
    ({ recipe }: RootState) => recipe
  );
  const [category, setCategory] = useState<number>(filterApplied.category);
  const [sort, setSort] = useState<number>(filterApplied.sort);

  useEffect(() => {
    if (active && !recipes.length) {
      dispatch(getAllRecipes());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, active, filterApplied.category, filterApplied.sort]);

  const handleScroll = (e) => {
    const isBottom =
      e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight;

    if (loading) return;

    if (isBottom && !loading && !outOfRecipe) {
      dispatch(getAllRecipes());
    }
  };

  const closeOptionDropdown = () => {
    setCategory(RECIPES_BY_CATEGORY.ALL);
    setSort(RECIPES_BY_SORT.RECENTLY);
    toggle();
  };

  const handleFilter = () => {
    if (category !== filterApplied.category || sort !== filterApplied.sort) {
      dispatch(clearAllRecipes());
      dispatch(
        setFilter({
          category,
          sort,
        })
      );
    }
    toggle();
  };

  return (
    <>
      <Drawer
        title='Community'
        open={active}
        hide={location.pathname !== '/home'}
        onClose={() => dispatch(uiActions.setCommunityDrawerShowing(false))}
      >
        <div className='flex items-stretch border-b border-gray-400'>
          <button
            type='button'
            className='flex items-center gap-1 pl-4 pr-5 py-2 text-sm border-r border-gray-400'
            onClick={toggle}
          >
            <Options20Regular />
            Filter
          </button>
          <div className='flex pl-5 pr-3 py-1'>
            <div className='flex flex-col pr-4'>
              <span className='text-2xs'>Category</span>
              <div className='text-orange -mt-0.5 text-sm'>
                {CATEGORY_NAME[filterApplied.category]}
              </div>
            </div>
            <div className='flex flex-col'>
              <span className='text-2xs'>Sort by</span>
              <div className='text-orange -mt-0.5 text-sm'>
                {SORT_NAME[filterApplied.sort]}
              </div>
            </div>
          </div>
        </div>
        <div
          className='h-full px-3 pt-4 pb-2 overflow-auto scrollbar-none'
          onScroll={handleScroll}
        >
          <CardList className='flex-row flex-wrap -mx-1'>
            {loading && !recipes.length
              ? [...Array(8).keys()].map((_, index) => (
                  <CardSmallSkeleton key={index} />
                ))
              : recipes.map((recipe: any) => (
                  <CardSmall key={recipe._id} {...recipe} />
                ))}
          </CardList>
          <div className='flex justify-center h-7'>
            {loading && recipes.length && (
              <Spinner color='var(--color-orange)' />
            )}
          </div>
          <div className='flex flex-col items-center -mt-7'>
            {outOfRecipe && (
              <>
                <img src={NoFound} alt='no more recipes' width='130' />
                <h3 className='font-semibold'>No more recipes!</h3>
                <p className='-mt-1'>You have seen it all.</p>
              </>
            )}
          </div>
        </div>
      </Drawer>
      <Dropdown isShowing={isShowing} onClose={closeOptionDropdown}>
        <h3 className='px-2 text-xl font-semibold'>Category</h3>
        <TagList className='px-2 pt-1.5 pb-4'>
          <>
            {Object.values(RECIPES_BY_CATEGORY).map((categoryItem) => (
              <Tag
                key={categoryItem}
                isActive={categoryItem === category}
                onClick={() => setCategory(categoryItem)}
              >
                {CATEGORY_NAME[categoryItem]}
              </Tag>
            ))}
          </>
        </TagList>
        <h3 className='px-2 text-xl font-semibold'>Sort</h3>
        <>
          {Object.values(RECIPES_BY_SORT).map((sortItem) => (
            <div
              key={sortItem}
              className={cx(
                'px-2 py-1 my-0.5 rounded transition-colors cursor-pointer hover:bg-gray-100',
                sort === sortItem && 'text-orange'
              )}
              onClick={() => setSort(sortItem)}
            >
              {SORT_NAME[sortItem]}
            </div>
          ))}
        </>
        <Button className='mt-4' onClick={handleFilter} fluid>
          Apply
        </Button>
      </Dropdown>
    </>
  );
};

export default CommunityDrawer;
