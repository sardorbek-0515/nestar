import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BoardArticle } from '../../libs/dto/board-article/board-article';

@Injectable() //U BoardArticleService klassiga "sen boshqa klasslarga inject qilinishing mumkin" degan belgi qo'yadi.
export class BoardArticleService {
    constructor(@InjectModel('BoardArticle') private readonly boardArticleModel: Model<BoardArticle>,) {}
}
