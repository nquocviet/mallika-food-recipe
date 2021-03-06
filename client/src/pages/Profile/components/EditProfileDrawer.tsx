import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Camera28Regular } from '@fluentui/react-icons';
import { Drawer } from '@components/Drawer';
import { TextInput } from '@components/Input';
import { Button } from '@components/Button';
import { Spinner } from '@components/Loading';
import { RootState } from '@redux/reducers';
import { uiActions } from '@features/ui-slice';
import { selectorUser, updateUser } from '@features/user-slice';
import { FlashMessageTypes, showFlash } from '@features/flash-slice';
import {
  convertBase64,
  generateBase64Image,
  resizeImage,
} from '@helpers/helpers';

export interface UpdateUserData {
  name: string;
  bio: string;
}

const EditProfileDrawer = () => {
  const [avatar, setAvatar] = useState<null | string>(null);
  const [isEdited, setIsEdited] = useState(false);
  const inputFileRef: any = useRef(null);
  const dispatch = useDispatch();
  const { register, reset, handleSubmit, setValue } = useForm();
  const user = useSelector(selectorUser);
  const loading = useSelector(({ loading }: RootState) => loading.authLoading);
  const active = useSelector(
    ({ ui }: RootState) => ui.editProfileDrawerShowing
  );

  const onCloseDrawer = (): void => {
    dispatch(uiActions.setEditProfileDrawerShowing(false));
    setAvatar(null);
    setIsEdited(false);
    reset(user);
  };

  const onChangeAvatar = (): void => {
    const input = inputFileRef.current;

    if (input) {
      input.click();
    }
  };

  const handleFileSelected = async (): Promise<void> => {
    const input = inputFileRef.current;

    if (input) {
      const files = input.files;
      const imageBase64 = await convertBase64(files[0]);
      const imageResize = await resizeImage(imageBase64, 150, 150);
      const [imageFormat, base64] = imageResize.split(';base64,');
      setAvatar(imageResize);
      setValue('avatar', {
        base64,
        imageFormat: imageFormat.split('/')[1],
      });
      setIsEdited(true);
    }
  };

  const onSubmit = async (data): Promise<void> => {
    if (!data.name) {
      dispatch(
        showFlash({
          message: 'Username is not allowed to be empty',
          type: FlashMessageTypes.ERROR,
        })
      );
      return;
    }

    const userEdited = {
      _id: user._id,
      ...data,
    };

    await dispatch(updateUser(userEdited));
    setIsEdited(false);
    dispatch(
      showFlash({
        message: 'Profile update successful!',
        type: FlashMessageTypes.SUCCESS,
      })
    );
  };

  return (
    <Drawer title='Edit Profile' open={active} onClose={() => onCloseDrawer()}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col items-stretch h-full px-layout pb-3'
      >
        <div className='flex items-center py-3 mb-3 border-b border-gray-300'>
          <input
            onChange={() => handleFileSelected()}
            ref={inputFileRef}
            type='file'
            className='hidden'
          />
          <div className='relative w-14 h-14 mr-3 rounded-full overflow-hidden'>
            <img
              src={avatar || generateBase64Image(user.avatar)}
              className='absolute inset-0'
              alt={user.name}
            />
          </div>
          <button
            type='button'
            className='inline-flex items-center gap-2 text-orange font-light'
            onClick={() => onChangeAvatar()}
          >
            <Camera28Regular />
            Edit photo
          </button>
        </div>
        <TextInput
          type='text'
          variant='secondary'
          name='email'
          defaultValue={user.email}
          placeholder='Enter your email address'
          label='email'
          className='mb-4'
          readOnly={true}
        />
        <TextInput
          type='text'
          variant='secondary'
          defaultValue={user.name}
          placeholder='Enter profile name'
          label='profile name'
          className='mb-4'
          {...register('name', {
            onChange: () => {
              setIsEdited(true);
            },
            onBlur: (e) => setValue('name', e.target.value.trim()),
          })}
        />
        <TextInput
          type='text'
          variant='secondary'
          defaultValue={user.bio}
          placeholder='Enter your bio'
          label='bio'
          className='mb-4'
          {...register('bio', {
            onChange: () => setIsEdited(true),
            onBlur: (e) => setValue('bio', e.target.value.trim()),
          })}
        />
        {loading ? (
          <Button type='button' variant='primary' className='mt-auto' disabled>
            <Spinner />
          </Button>
        ) : (
          <Button
            type='submit'
            variant={isEdited ? 'primary' : 'disabled'}
            className='mt-auto'
            disabled={!isEdited}
          >
            Save Changes
          </Button>
        )}
      </form>
    </Drawer>
  );
};

export default EditProfileDrawer;
