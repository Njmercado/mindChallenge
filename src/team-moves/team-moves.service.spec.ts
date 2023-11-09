import { Test, TestingModule } from '@nestjs/testing';
import { TeamMovesService } from './team-moves.service';

describe('TeamMovesService', () => {
  let service: TeamMovesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeamMovesService],
    }).compile();

    service = module.get<TeamMovesService>(TeamMovesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
