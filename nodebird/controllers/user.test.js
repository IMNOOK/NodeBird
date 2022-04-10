const { updateProfile, following, followDelete, likeing, likeDelete } = require('./user');
// 모듈 모킹
jest.mock('../models/item');
const { item } = require('../models/item');


describe('following', () => {
	const req = {
		user: { id : 1 },
		params: { id: 2 }
	};
	const res = {
		send: jest.fn(),
		status: jest.fn(() => res),
	};
	const next = jest.fn();
	
	test('사용자를 찾아 팔로잉을 추가하고 success를 응답해야 함', async() => {
		item.setFollow.mockReturnValue(1);
		await following(req, res, next);
		expect(res.send).toBeCalledWith('success');
	});
	
	test('사용자를 못 찾으면 res.status(404).send(no user)를 호출함', async() => {
		item.setFollow.mockReturnValue(0);
		await following(req, res, next);
		expect(res.status).toBeCalledWith(404);
		expect(res.send).toBeCalledWith('no user');
	});
	
	test('DB에서 에러가 발생하면 next(error) 호출함', async() => {
		const error = '테스트용 에러';
		item.setFollow.mockReturnValue(Promise.reject(error));
		await following(req, res, next);
		expect(next).toBeCalledWith(error);
	});
});