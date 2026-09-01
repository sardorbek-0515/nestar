import { Resolver } from '@nestjs/graphql';
import { BoardArticleService } from './board-article.service';

@Resolver()
export class BoardArticleResolver { //rezolverga service ni inject qilamiz
    constructor(private readonly boardArticleService: BoardArticleService) {}
}
