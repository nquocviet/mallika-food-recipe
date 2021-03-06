import {
  useState,
  ReactChild,
  ReactChildren,
  Fragment,
  cloneElement,
} from 'react';
import cx from 'clsx';
import { Info20Filled } from '@fluentui/react-icons';
import { Tooltip } from '@components/Tooltip';

interface TabsProps {
  children: ReactChild | ReactChildren | ReactChild[] | ReactChildren[];
  className?: string;
  labelContainerClassName?: string;
  labelClassName?: string;
  onTrigger?: () => void;
}

interface TabProps {
  children: ReactChild | ReactChildren | ReactChild[] | ReactChildren[];
  className?: string;
  label: string;
  ref?: any;
  error?: string;
  onScroll?: (e) => void;
}

interface TabLabelProps {
  children: ReactChild | ReactChildren;
  isActive: boolean;
  className?: string;
  error?: string;
  onClick: () => void;
}

const TabLabel: React.FC<TabLabelProps> = ({
  children,
  isActive,
  className,
  error,
  ...rest
}) => {
  const isSameSize = className && className.includes('flex-1');
  const defaultClassName =
    'relative text-center cursor-pointer py-1.5 px-2 rounded-3xl transition-all duration-200';
  const allClassNames = cx(
    defaultClassName,
    isSameSize ? 'flex-1' : 'flex-auto',
    isActive
      ? 'bg-orange text-white'
      : 'bg-transparent text-gray-800 hover:bg-gray-100'
  );

  return (
    <li className={allClassNames} {...rest}>
      {children}
      {error && (
        <Tooltip
          message={error}
          className='absolute top-0.5 -right-2 -translate-y-1/2 text-red-500'
        >
          <Info20Filled className='bg-white rounded-full' />
        </Tooltip>
      )}
    </li>
  );
};

export const Tabs: React.FC<TabsProps> = ({
  children,
  className,
  labelContainerClassName,
  labelClassName,
  onTrigger,
  ...rest
}) => {
  const [activeTab, setActiveTab] = useState(children[0].props.label);
  const defaultTabsClassName = 'flex flex-col items-stretch';
  const tabsClassNames = cx(defaultTabsClassName, className);
  const defaultTabLabelContainerClassName =
    'flex gap-3 border-b border-gray-400 px-layout pb-2';
  const tabLabelContainerClassNames = cx(
    defaultTabLabelContainerClassName,
    labelContainerClassName
  );

  const changeTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className={tabsClassNames} {...rest}>
      <ul className={tabLabelContainerClassNames}>
        {children instanceof Array &&
          children.map((child, index) => (
            <TabLabel
              key={index}
              isActive={child.props.label === activeTab}
              className={labelClassName}
              onClick={() => {
                onTrigger && onTrigger();
                changeTab(child.props.label);
              }}
              error={child.props.error && child.props.error}
            >
              {child.props.label}
            </TabLabel>
          ))}
      </ul>
      {children instanceof Array &&
        children.map((child, index) => {
          const className = cx(
            child.props.className,
            child.props.label !== activeTab && 'hidden'
          );

          return (
            <Fragment key={index}>
              {cloneElement(child, {
                className,
              })}
            </Fragment>
          );
        })}
    </div>
  );
};

export const Tab: React.FC<TabProps> = ({
  children,
  label,
  className,
  onScroll,
  ...rest
}) => {
  return (
    <div className={className} onScroll={onScroll} {...rest}>
      {children}
    </div>
  );
};
