import { describe, it, expect, vi } from 'vitest';
import { load, actions, getUserDetails, uploadToS3, deleteFromS3, verifyOldPassword, validatePassword, updatePassword } from './+page.server';
import { ObjectId } from 'mongodb';
import { HASH_OPTIONS } from '$src/constants';
import { upload, deleteFile } from '$src/lib/server/storage';
import { verify, hash } from '@node-rs/argon2';
import { fail } from '@sveltejs/kit';
import Users from '$db/schemas/User';

vi.mock('$db/schemas/User', () => ({
    default: {
        findById: vi.fn(),
        findByIdAndUpdate: vi.fn()
    }
}));

vi.mock('$src/lib/server/storage', () => ({
    upload: vi.fn(),
    deleteFile: vi.fn()
}));

vi.mock('@node-rs/argon2', () => ({
    verify: vi.fn(),
    hash: vi.fn()
}));

vi.mock('@sveltejs/kit', () => ({
    fail: vi.fn()
}));

describe('Page Server', () => {
  
  describe('load', () => {
    it('should return user data if user is logged in', async () => {
      const locals = { user: { _id: '507f1f77bcf86cd799439011' } }; // Use a valid ObjectId string
      const user = { _id: new ObjectId('507f1f77bcf86cd799439011'), name: 'John', surname: 'Doe', email: 'john@example.com', image: 'image.jpg', username: 'johndoe' };
      Users.findById.mockResolvedValue(user);

      const result = await load({ locals });

      expect(result).toEqual({
        user_data: {
          id: user._id.toString(),
          name: user.name,
          surname: user.surname,
          email: user.email,
          image: user.image,
          username: user.username
        }
      });
    });

    it('should return undefined if user is not logged in', async () => {
      const locals = {};
      const result = await load({ locals });
      expect(result).toBeUndefined();
    });
  });

  describe('getUserDetails', () => {
    it('should return user details', async () => {
      const user_id = '507f1f77bcf86cd799439011';
      const user = { _id: new ObjectId('507f1f77bcf86cd799439011'), name: 'John', surname: 'Doe', email: 'john@example.com', image: 'image.jpg', username: 'johndoe' };
      Users.findById.mockResolvedValue(user);

      const result = await getUserDetails(new ObjectId(user_id));

      expect(result).toEqual({
        id: '507f1f77bcf86cd799439011',
        name: 'John',
        surname: 'Doe',
        email: 'john@example.com',
        image: 'image.jpg',
        username: 'johndoe'
      });
    });
  });

  describe('uploadToS3', () => {
    it('should fail if file size is too large', async () => {
      const image = { size: 2 * 1024 * 1024 }; // 2MB
      const locals = { user: { id: '123' } };

      const result = await uploadToS3(image, locals);

      expect(fail).toHaveBeenCalledWith(400, { error: 'File size too large' });
    });

    it('should upload image and update user', async () => {
      const image = { size: 500 * 1024 }; // 500KB
      const locals = { user: { id: '123' } };
      const user = { save: vi.fn() };
      Users.findById.mockResolvedValue(user);
      upload.mockResolvedValue('image_url');

      const result = await uploadToS3(image, locals);

      expect(upload).toHaveBeenCalledWith(image);
      expect(user.save).toHaveBeenCalled();
      expect(result).toEqual({ image_url: 'image_url' });
    });
  });

  describe('deleteFromS3', () => {
    it('should delete image and update user', async () => {
      const locals = { user: { id: '123' } };
      const user = { image: 'image_url', save: vi.fn() };
      Users.findById.mockResolvedValue(user);

      const result = await deleteFromS3(locals);

      expect(deleteFile).toHaveBeenCalledWith('image_url');
      expect(user.save).toHaveBeenCalled();
      expect(result).toEqual({ image_url: 'https://class-connect-file-storage.s3.amazonaws.com/pictures/default.svg' });
    });
  });

  describe('verifyOldPassword', () => {
    it('should return true if password is valid', async () => {
      const objID = '123';
      const old_password = 'password';
      const user = { password: 'hashed_password' };
      Users.findById.mockResolvedValue(user);
      verify.mockResolvedValue(true);

      const result = await verifyOldPassword(objID, old_password);

      expect(result).toBe(true);
    });

    it('should return false if password is invalid', async () => {
      const objID = '123';
      const old_password = 'password';
      const user = { password: 'hashed_password' };
      Users.findById.mockResolvedValue(user);
      verify.mockResolvedValue(false);

      const result = await verifyOldPassword(objID, old_password);

      expect(result).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should throw error if password is invalid', () => {
      expect(() => validatePassword('invalid', 'invalid')).toThrow('Invalid password');
    });

    it('should throw error if passwords do not match', () => {
      expect(() => validatePassword('Valid1@', 'Different1@')).toThrow('Passwords do not match');
    });

    it('should return password if valid', () => {
      const password = 'Valid1@';
      const confirmPassword = 'Valid1@';
      const result = validatePassword(password, confirmPassword);
      expect(result).toBe(password);
    });
  });

  describe('updatePassword', () => {
    it('should update user password', async () => {
      const userID = '123';
      const password = 'new_password';
      const hashedPassword = 'hashed_password';
      hash.mockResolvedValue(hashedPassword);
      Users.findByIdAndUpdate.mockResolvedValue({});

      await updatePassword(userID, password);

      expect(hash).toHaveBeenCalledWith(password, HASH_OPTIONS);
      expect(Users.findByIdAndUpdate).toHaveBeenCalledWith(userID, { password: hashedPassword });
    });
  });

  describe('actions', () => {
    describe('update_general_details', () => {
      it('should update general details', async () => {
        const request = {
          formData: vi.fn().mockResolvedValue({
            get: vi.fn().mockImplementation((key) => {
              const data = { name: 'John', surname: 'Doe', email: 'john@example.com' };
              return data[key];
            })
          })
        };
        const locals = { user: { id: '123' } };

        await actions.update_general_details({ request, locals });

        expect(Users.findByIdAndUpdate).toHaveBeenCalledWith('123', { name: 'John', surname: 'Doe', email: 'john@example.com' });
      });
    });

    describe('get_user_details', () => {
      it('should return user details', async () => {
        const locals = { user: { id: '123' } };                                            
        const user = {name :"John",surname:"Doe",email:"john@example.com",image:"image.jpg"};
        Users.findById.mockResolvedValue(user);

        const result = await actions.get_user_details({ locals });

        expect(JSON.parse(result)).toEqual({ user });
      });
    });
  });
});                                                                                                  