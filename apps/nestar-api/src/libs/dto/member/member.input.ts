import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { MemberAuthType, MemberType } from '../../enums/member.enum';

@InputType()
export class MemberInput { // DTO (Data Transfer Object) for member input
	@IsNotEmpty() //bosh bolmasligi kerak
	@Length(3, 12)// uzunligi 3 dan 12 gacha bolishi kerak
	@Field(() => String)// GraphQL field type
	memberNick: string | undefined; 

	@IsNotEmpty()
	@Length(5, 12)
	@Field(() => String)
	memberPassword: string | undefined;

	@IsNotEmpty()
	@Field(() => String)
	memberPhone: string | undefined;

	@IsOptional()
	@Field(() => MemberType, { nullable: true })
	memberType?: MemberType;

	@IsOptional()
	@Field(() => MemberAuthType, { nullable: true })
	memberAuthType?: MemberAuthType;
}

@InputType()
export class LoginInput {
	@IsNotEmpty()
	@Length(3, 12)
	@Field(() => String)
	memberNick: string | undefined;

	@IsNotEmpty()
	@Length(5, 12)
	@Field(() => String)
	memberPassword: string | undefined;
}