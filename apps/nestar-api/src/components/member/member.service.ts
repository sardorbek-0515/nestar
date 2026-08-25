import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Member, Members } from '../../libs/dto/member/member';
import { AgentsInquiry, LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { MemberStatus, MemberType } from '../../libs/enums/member.enum';
import { Direction, Message } from '../../libs/enums/common.enum';
import { AuthService } from '../auth/auth.service';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { T } from '../../libs/types/common';
import { ViewService } from '../view/view.service';
import { ViewGroup } from '../../libs/enums/view.enum';
import { ViewInput } from '../../libs/dto/view/view.input';

@Injectable()
export class MemberService {
	/** --------------------------- mongoose --------------------------- **/
	constructor(
		@InjectModel('Member') private readonly memberModel: Model<Member>,
		private authService: AuthService,
		private viewService: ViewService,
	) {}
	/** --------------------------- signup --------------------------- **/
	public async signup(input: MemberInput): Promise<Member> {
		// TODO: Hash password
		input.memberPassword = await this.authService.hashPassword(input.memberPassword);

		try {
			const result = await this.memberModel.create(input);
			// TODO: Authentication via TOKEN
			result.accessToken = await this.authService.createToken(result);

			return result;
		} catch (err) {
			console.log('Error, Service.model:', err);
			throw new BadRequestException(Message.USED_MEMBER_NICK_OR_PHONE);
		}
	}

	/** --------------------------- login --------------------------- **/
	public async login(input: LoginInput): Promise<Member> {
		const { memberNick, memberPassword } = input;
		const response: Member = await this.memberModel
			.findOne({ memberNick: memberNick })
			.select('+memberPassword')
			.exec();

		if (!response || response.memberStatus === MemberStatus.DELETE) {
			throw new InternalServerErrorException(Message.NO_MEMBER_NICK);
		} else if (response.memberStatus === MemberStatus.BLOCK) {
			throw new InternalServerErrorException(Message.BLOCKED_USER);
		}

		// TODO: Compare passwords
		console.log('response:', response);
		const isMatch = await this.authService.comparePassword(input.memberPassword, response.memberPassword);
		if (!isMatch) throw new InternalServerErrorException(Message.WRONG_PASSWORD);
		response.accessToken = await this.authService.createToken(response);

		return response;
	}

	/** --------------------------- updateMember --------------------------- **/
	public async updateMember(memberId: ObjectId, input: MemberUpdate): Promise<Member> {
		const result =  await this.memberModel
		.findByIdAndUpdate(
			{
			_id: memberId, 
			memberStatus: MemberStatus.ACTIVE
		  }, 
		  input, 
		  { new: true },
	    )
	    .exec();
		if(!result) throw new InternalServerErrorException(Message.UPLOAD_FAILED);

		result.accessToken = await this.authService.createToken(result);
		return result;
	}

	/** --------------------------- getMember --------------------------- **/
	public async getMember(memberId: ObjectId, targetId: ObjectId): Promise<Member> {
		const search: T = {
			_id: targetId,
			memberStatus: {
				$in: [MemberStatus.ACTIVE, MemberStatus.BLOCK],
			},
		};
		const tergetMember = await this.memberModel.findOne(search).lean().exec();
		if (!tergetMember) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		if(memberId) {
			// record view
			const viewInput = {memberId: memberId, viewRefId: targetId, viewGroup: ViewGroup.MEMBER};
			const newView =await this.viewService.recordView(viewInput); // record view
			if(newView) {
				//increase memberViews
				await this.memberModel.findByIdAndUpdate(search, {$inc: {memberViews: 1}}, {new: true}).exec(); 
				tergetMember.memberViews ++ ; 
			}

			// meLiked
			// meFollowed
			//
			
		}
		
		return tergetMember;
	}

	/** --------------------------- getAgents --------------------------- **/
	public async getAgents(memberId: ObjectId, input: AgentsInquiry): Promise<Members> {
		const {text} = input.search;
        const match: T = {memberType: MemberType.AGENT, memberStatus: MemberStatus.ACTIVE };
		const sort:T = {[input?.sort ?? "createdAt"]: input?.direction ?? Direction.DESC };

		if(text) match.memberNick = {$regex: new RegExp(text, "i")};
		console.log("match:", match);
		
		const result = await this.memberModel
		  .aggregate([
			{$match: match},
			{$sort: sort},
			{
				$facet:{
					list: [{ $skip: (input.page - 1) * input.limit}, { $limit: input.limit }],
					metaCounter: [{ $count: 'total'}],
				},
			},
		])
		.exec();
		// console.log('result:', result);
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND)

 
		return result[0];
	}

	

	/** --------------------------- getAllMembersByAdmin --------------------------- **/
	public async getAllMembersByAdmin(): Promise<string> {
		return 'getAllMembersByAdmin executed!';
	}

	/** --------------------------- updateMemberByADmin --------------------------- **/
	public async updateMemberByADmin(): Promise<string> {
		return 'updateMemberByADmin executed';
	}
}