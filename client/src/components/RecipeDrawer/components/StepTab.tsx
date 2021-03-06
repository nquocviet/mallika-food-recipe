import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Add20Filled } from '@fluentui/react-icons';
import { RoundedButton } from '@components/Button';
import useToggle from '@hooks/useToggle';
import { selectorRecipeSteps } from '@features/recipe-slice';
import ListEmpty from '@img/list-empty.png';
import RecipeWidget from './RecipeWidget';
import ModalAddWidget from './ModalAddWidget';

const StepTab = () => {
  const initialInputValue = {
    title: '',
    isHeader: false,
  };
  const [inputValue, setInputValue] = useState(initialInputValue);
  const [editable, setEditable] = useState(false);
  const { isShowing, toggle } = useToggle();
  const steps = useSelector(selectorRecipeSteps);

  return (
    <>
      <div className='relative h-full flex flex-col items-stretch px-3 pt-3'>
        {steps.length > 0 ? (
          steps.map((ingredient, index) => (
            <RecipeWidget
              key={ingredient._id}
              type='steps'
              index={index}
              setEditable={setEditable}
              setInputValue={setInputValue}
              {...ingredient}
            />
          ))
        ) : (
          <div className='flex flex-col items-center text-center pt-8 px-4'>
            <img src={ListEmpty} alt='no steps yet' width='180' />
            <h4 className='font-semibold'>No steps yet!</h4>
            <p>Click the button below to create some steps.</p>
          </div>
        )}
        <div className='fixed bottom-4 right-4'>
          <RoundedButton variant='primary' onClick={toggle}>
            <Add20Filled />
          </RoundedButton>
        </div>
      </div>
      <ModalAddWidget
        type='steps'
        isShowing={isShowing}
        toggle={toggle}
        editable={editable}
        inputValue={inputValue}
        setInputValue={setInputValue}
        setEditable={setEditable}
      />
    </>
  );
};

export default StepTab;
