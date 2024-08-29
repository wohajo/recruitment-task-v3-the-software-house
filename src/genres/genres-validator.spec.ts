import { Test, TestingModule } from '@nestjs/testing';
import { GenresService } from './genres.service';
import { GenresValidator } from './genres-validator';
import { BadRequestException, ExecutionContext } from '@nestjs/common';

describe(GenresValidator.name, () => {
  let service: GenresService;
  let validator: GenresValidator;
  let requestSpy: jest.Mock<any, any>;
  let fixtures: ReturnType<typeof getFixtures>;

  const executionContext: ExecutionContext = {
    switchToHttp: () => ({
      getNext: jest.fn().mockReturnThis(),
      getRequest: requestSpy,
      getResponse: jest.fn().mockReturnThis(),
    }),
    getClass: jest.fn().mockReturnThis(),
    getHandler: jest.fn().mockReturnThis(),
    getArgs: jest.fn().mockReturnThis(),
    getArgByIndex: jest.fn().mockReturnThis(),
    switchToRpc: jest.fn().mockReturnThis(),
    switchToWs: jest.fn().mockReturnThis(),
    getType: jest.fn().mockReturnThis(),
  };

  const callHandler = {
    handle: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenresValidator,
        {
          provide: GenresService,
          useValue: {
            getGenres: jest.fn().mockReturnValue(['Comedy', 'Action', 'Drama']),
          },
        },
      ],
    }).compile();

    service = module.get<GenresService>(GenresService);
    validator = new GenresValidator(service);
    fixtures = getFixtures();
  });

  it('should be defined', () => {
    expect(validator).toBeDefined();
  });

  it('Should throw on bad genre', async () => {
    fixtures.given.invalidGenre();

    expect(() => fixtures.when.validating()).toThrow(
      new BadRequestException('Invalid genre'),
    );
  });

  it('Should throw on empty genre', async () => {
    fixtures.given.emptyGenre();

    expect(() => fixtures.when.validating()).toThrow(
      new BadRequestException('Invalid genre'),
    );
  });

  it('Should validate on valid genre', async () => {
    fixtures.given.validGenre();
    fixtures.given.mockHandler();

    const result = fixtures.when.validating();

    fixtures.then.callHandler.wasReturned(result);
    fixtures.then.callHandler.wasCalled();
  });

  const getFixtures = () => {
    const mockHandler = Symbol('mockHandler next');

    return {
      given: {
        invalidGenre: () => {
          requestSpy = jest.fn().mockReturnValue({
            body: { genres: ['Bad'] },
          });
        },
        emptyGenre: () => {
          requestSpy = jest.fn().mockReturnValue({
            body: { genres: [] },
          });
        },
        validGenre: () => {
          requestSpy = jest.fn().mockReturnValue({
            body: { genres: ['Action'] },
          });
        },
        mockHandler: () => {
          callHandler.handle.mockReturnValue(mockHandler);
        },
      },
      when: {
        validating: () => validator.intercept(executionContext, callHandler),
      },
      then: {
        callHandler: {
          wasReturned: (result: any) => {
            expect(result).toBe(mockHandler);
          },
          wasCalled: () => {
            expect(callHandler.handle).toHaveBeenCalledTimes(1);
          },
        },
      },
    };
  };
});
