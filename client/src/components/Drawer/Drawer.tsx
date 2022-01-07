import React, { useState, ReactChild, ReactChildren } from 'react';
import ReactDOM from 'react-dom';
import { ChevronLeft24Regular } from '@fluentui/react-icons';
import cx from 'clsx';

interface DrawerProps {
  open: boolean;
  title: string;
  children: ReactChild | ReactChildren | ReactChild[] | ReactChildren[];
  onClose: () => void;
}

const Drawer: React.FC<DrawerProps> = ({ open, onClose, title, children }) => {
  const [active, setActive] = useState<boolean>(true);
  const defaultClassName =
    'w-full h-full bg-white py-5 flex flex-col items-stretch';
  const allClassNames = cx(
    defaultClassName,
    active ? 'animate-slide-in' : 'animate-slide-out'
  );

  const onCloseDrawer = (): void => {
    setActive(false);
    setTimeout(() => {
      onClose();
      setActive(true);
    }, 250);
  };

  return open
    ? ReactDOM.createPortal(
        <div className='pt-6 absolute z-40 inset-0 w-full h-full'>
          <div className={allClassNames}>
            <div className='px-layout pb-3 border-b border-gray-400'>
              <div className='relative flex items-center'>
                <button onClick={onCloseDrawer}>
                  <ChevronLeft24Regular />
                </button>
                <h3 className='text-xl whitespace-nowrap absolute left-1/2 top-1/2 -mt-0.5 -translate-x-1/2 -translate-y-1/2'>
                  {title}
                </h3>
              </div>
            </div>
            {children}
          </div>
        </div>,
        document.querySelector('main')
      )
    : null;
};

export default Drawer;
