import { Test, TestingModule } from '@nestjs/testing';
import { TeamMovesController } from './team-moves.controller';
import { TeamMovesService } from './team-moves.service';

describe('TeamMovesController', () => {
  let controller: TeamMovesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamMovesController],
      providers: [TeamMovesService],
    }).compile();

    controller = module.get<TeamMovesController>(TeamMovesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
