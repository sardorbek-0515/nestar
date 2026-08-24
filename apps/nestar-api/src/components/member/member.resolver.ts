import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { Member } from '../../libs/dto/member/member';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';

@Resolver()
export class MemberResolver {
	constructor(private readonly memberService: MemberService) {}

	/** --------------------------- signup --------------------------- **/
	@Mutation(() => Member) // @Mutation(POST)
	public async signup(@Args('input') input: MemberInput): Promise<Member> {
		console.log('Mutation: signup');
		return this.memberService.signup(input);
	}

	/** --------------------------- login --------------------------- **/
	@Mutation(() => Member) // @Mutation(POST)
	public async login(@Args('input') input: LoginInput): Promise<Member> {
		console.log('Mutation: login');
		return this.memberService.login(input);
	}


    // Authenticated bolgan userlar kra oladi updateMemberga (user.admin.agent)
	/** --------------------------- updateMember --------------------------- **/
	@UseGuards(AuthGuard)
	@Mutation(() => String) // @Mutation(POST)
	public async updateMember(@AuthMember ('_id')  memberId: ObjectId): Promise<string> {
		console.log('Mutation: updateMember');
		// console.log(typeof memberId);
		// console.log(memberId);
		return this.memberService.updateMember();
	}
 
	/** --------------------------- getMember --------------------------- **/
	@Query(() => String) // @Query (GET)
	public async getMember(): Promise<string> {
		console.log('Query: getMember');
		return this.memberService.getMember();
	}

	@UseGuards(AuthGuard)
	@Query(() => String) // @Mutation(POST)
	public async checkAuth(@AuthMember('memberNick') memberNick: string): Promise<string> {
		console.log('Query: checkAuth');
		console.log('memberNick:', memberNick);
		console.log(memberNick);
		return `Hi ${memberNick}`;
	}

	/** --------------------------- getAllMembers --------------------------- **/ 
	// Authhorization: ADMIN faqat
	@Mutation(() => String)
	public async getAllMembers(): Promise<string> {
		console.log('Mutation: getAllMembers');
		return this.memberService.getAllMembers();
	}
    
	// Authhorization: ADMIN faqat
	@Mutation(() => String)
	public async updateMemberByAdmin(): Promise<string> {
		console.log('Mutation: updateMemberByAdmin');
		return this.memberService.updateMember();
	}
}