import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Property } from '../../nestar-api/src/libs/dto/property/property';
import { Member } from '../../nestar-api/src/libs/dto/member/member';
import { PropertyStatus } from '../../nestar-api/src/libs/enums/property.enum';
import { MemberStatus, MemberType } from '../../nestar-api/src/libs/enums/member.enum';

@Injectable()
export class BatchService {
	constructor(
		@InjectModel('Property') private readonly propertyModel: Model<Property>,
		@InjectModel('Member') private readonly memberModel: Model<Member>,
	) {}

	 /** --------------------------- batchRollback --------------------------- **/
	public async batchRollback(): Promise<void> {
		await this.propertyModel
			.updateMany(
				{
					propertyStatus: PropertyStatus.ACTIVE,
				},
				{ propertyRank: 0 },
			)
			.exec();

		    await this.memberModel
			.updateMany(
				{
					memberStatus: MemberStatus.ACTIVE,
					memberType: MemberType.AGENT,
				},
				{ memberRank: 0 },
			)
			.exec();
	}

	  /** --------------------------- batchTopProperties --------------------------- **/

	public async batchTopProperties(): Promise<void> {
		const properties: Property[] = await this.propertyModel
			.find({
				propertyStatus: PropertyStatus.ACTIVE,
				propertyRank: 0,
			})
			.exec();

		    const promisedList = properties.map(async (ele: Property) => {
			const { _id, propertyLikes, propertyViews } = ele; //distraction
			const rank = propertyLikes * 2 + propertyViews * 1; // property rank 25*2=50 30*1=30 ==80chiqadi
			return await this.propertyModel.findByIdAndUpdate(_id, { propertyRank: rank });//osha renk chanche
		});
		await Promise.all(promisedList);
	}

	   /** --------------------------- batchTopAgents --------------------------- **/

	public async batchTopAgents(): Promise<void> { //agentlarni renkniki baholaymiz
		const agents: Member[] = await this.memberModel
			.find({
				memberType: MemberType.AGENT,
				memberStatus: MemberStatus.ACTIVE,
				memberRank: 0,
			})
			.exec();

		const promisedList = agents.map(async (ele: Member) => {
			const { _id, memberProperties, memberLikes, memberArticles, memberViews } = ele;
			const rank =
				memberProperties * 5 + memberArticles * 3 + memberLikes * 2 + memberViews * 1;
			return await this.memberModel.findByIdAndUpdate(_id, { memberRank: rank });
		});
		await Promise.all(promisedList);
	}

	public getHello(): string {
		return 'Welcome to Nestar BATCH Server!';
	}
}