import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BoardArticleService } from './board-article.service';
import { BoardArticle, BoardArticles } from '../../libs/dto/board-article/board-article';
import {
	BoardArticleInput,
	BoardArticlesInquiry,
} from '../../libs/dto/board-article/board-article.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { WithoutGuard } from '../auth/guards/without.guard';
import { BoardArticleUpdate } from '../../libs/dto/board-article/board-article.update';
@Resolver()
export class BoardArticleResolver {
	constructor(private readonly boardArticleService: BoardArticleService) {}
     

    /** --------------------------- createBoardArticle --------------------------- **/
	@UseGuards(AuthGuard)
	@Mutation(() => BoardArticle)//new articleni dto orqali yuboradi
	public async createBoardArticle(
		@Args('input') input: BoardArticleInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<BoardArticle> {
		console.log('Mutation: createBoardArticle');
		return await this.boardArticleService.createBoardArticle(memberId, input);
	}
    
    /** --------------------------- getBoardArticle --------------------------- **/
	@UseGuards(WithoutGuard)//auth guard bolmagan userlar ham kirishi mumkin
	@Query(() => BoardArticle)//dto orqali bitta articleni qaytaradi
	public async getBoardArticle(
		@Args('articleId') input: string,//mdb articleId ni string qilib qabul qiladi
		@AuthMember('_id') memberId: ObjectId,
	): Promise<BoardArticle> {
		console.log('Query: getBoardArticle');
		const articleId = shapeIntoMongoObjectId(input);
		return await this.boardArticleService.getBoardArticle(memberId, articleId);
	}
    
     /** --------------------------- updateBoardArticle --------------------------- **/
	@UseGuards(AuthGuard)
	@Mutation(() => BoardArticle)
	public async updateBoardArticle(
		@Args('input') input: BoardArticleUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<BoardArticle> {
		console.log('Mutation: updateBoardArticle');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.boardArticleService.updateBoardArticle(memberId, input);
	}
    

    /** --------------------------- getBoardArticles --------------------------- **/
	@UseGuards(WithoutGuard)//auth guard bolmagan userlar ham kirishi mumkin
	@Query(() => BoardArticles)//dto orqali articleni listini qaytaradi
	public async getBoardArticles(
		@Args('input') input: BoardArticlesInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<BoardArticles> {
		console.log('Query: getBoardArticles');
		return await this.boardArticleService.getBoardArticles(memberId, input);
	}
}