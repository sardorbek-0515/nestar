import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { AgentsInquiry, LoginInput, MemberInput, MembersInquiry } from '../../libs/dto/member/member.input';
import { Member, Members } from '../../libs/dto/member/member';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { WithoutGuard } from '../auth/guards/without.guard';

@Resolver()
export class MemberResolver {
	constructor(private readonly memberService: MemberService) {}

	/** --------------------------- signup --------------------------- **/
	@Mutation(() => Member) // @Mutation(POST)
	public async signup(@Args('input') input: MemberInput): Promise<Member> {
		console.log('Mutation: signup');
		return await this.memberService.signup(input);
	}

	/** --------------------------- login --------------------------- **/
	@Mutation(() => Member) // @Mutation(POST)
	public async login(@Args('input') input: LoginInput): Promise<Member> {
		console.log('Mutation: login');
		return await this.memberService.login(input);
	}


	@UseGuards(AuthGuard)   //Authentication 
	@Query(() => String) // @Mutation(POST)
	public async checkAuth(@AuthMember('memberNick') memberNick: string): Promise<string> {
		console.log('Query: checkAuth');
		console.log('memberNick:', memberNick);
		console.log(memberNick);
		return `Hi ${memberNick}`;
	}


	@Roles(MemberType.USER, MemberType.AGENT) 	// Authorization:
	@UseGuards(RolesGuard)
	@Query(() => String) // @Mutation(POST)
	public async checkAuthRoles(@AuthMember() authMember: Member): Promise<string> {
		console.log('Query: checkAuthRoles');

		return `Hi ${authMember.memberNick},you are ${authMember.memberType} (memerId: ${authMember._id})`;
	}


    // Authenticated bolgan userlar kra oladi updateMemberga (user.admin.agent)
	/** --------------------------- updateMember --------------------------- **/
	@UseGuards(AuthGuard)
	@Mutation(() => Member) // @Mutation(POST)
	public async updateMember(
		@Args('input') input: MemberUpdate,
		@AuthMember ('_id')  memberId: ObjectId
	): Promise<Member> {
		console.log('Mutation: updateMember');
		// console.log(typeof memberId);
        delete input._id; // _id ni inputdan o'chirib tashlaymiz, chunki u update qilinmaydi
		return await this.memberService.updateMember(memberId, input);
	}

	/** --------------------------- getMember --------------------------- **/
	@UseGuards(WithoutGuard)
	@Query(() => Members) // @Query (GET)
	public async getMember(@Args("memberId") input: string, @AuthMember('_id') memberId: ObjectId): Promise<Member> {
		console.log('Query: getMember');
		console.log('memberId:', memberId);
		const targetId = shapeIntoMongoObjectId(input);
		return await this.memberService.getMember(memberId, targetId);
	}

	 /** --------------------------- getAgents --------------------------- **/
    @UseGuards(WithoutGuard)
	@Query(() => Members) // @Query (GET)
	public async getAgents(@Args('input') input: AgentsInquiry, @AuthMember('_id') memberId: ObjectId): Promise<Members> {
		console.log('Query: getAgents');  
		return await this.memberService.getAgents(memberId, input);
	}




                   /** =============== ADMIN ============= **/ 
	/** --------------------------- getAllMembersByAdmin --------------------------- **/

	// Authorization: ADMIN
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query(() => Members)
	public async getAllMembersByAdmin(@Args('input') input: MembersInquiry): Promise<Members> {
				console.log('Query: getAllMembersByAdmin');  
		return await this.memberService.getAllMembersByAdmin(input);
	}

	/** --------------------------- updateMemberByADmin --------------------------- **/
	// Authorization: ADMIN

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Member) // @Mutation(POST)
	public async updateMemberByAdmin(@Args('input') input: MemberUpdate): Promise<Member> {
		console.log('Mutatiom: updateMemberByAdmin');
		return await this.memberService.updateMemberByAdmin(input);
	}
}