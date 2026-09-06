import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Min } from 'class-validator';
import { ObjectId } from 'mongoose';

@InputType()
class FollowSearch {
	@IsOptional()
	@Field(() => String, { nullable: true })
	followingId?: ObjectId; // (kimni kuzatishi bo'yicha)

	@IsOptional()
	@Field(() => String, { nullable: true })
	followerId?: ObjectId; // (kim kuzatayotganini aniqlash uchun)
}

@InputType()
export class FollowInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number; // sahifa raqami, pagination uchun

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number; // (har bir sahifada nechta element ko'rsatilishini belgilaydi)

	@IsNotEmpty()
	@Field(() => FollowSearch)
	search: FollowSearch;
}
